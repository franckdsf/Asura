import groq from "groq"
import { DATASET, PROJECT_ID, loadQuery, urlFor } from "sanity";
import type {
  ContentBigTitle, ContentMoreInformation, ContentDescription, ImageWithUrl, Global,
  ActionBlock,
  HomePage,
  ProductPage,
  MediaWithUrl,
  Block,
  CartModule
} from "./sanity.types";

const urlForVideo = (id: string) => {
  // remove the first "file-" from the string
  const idWithoutFile = id.startsWith("file-") ? id.substring(5) : id;
  // replace last "-" with a "."
  const idWithExtension = idWithoutFile.replaceAll("-", ".");

  return { url: () => `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${idWithExtension}` };
}

const parseActionBlock = (block: ActionBlock) => {
  const mainMediaWithUrl: MediaWithUrl = {
    ...block.mainMedia,
    image: block.mainMedia.image ? {
      ...block.mainMedia.image,
      url: urlFor(block.mainMedia.image.asset._ref).width(1200).url()
    } : undefined,
    video: block.mainMedia.video ? {
      ...block.mainMedia.video,
      url: urlForVideo(block.mainMedia.video.asset._ref).url()
    } : undefined,
  }

  const additionalMediaWithUrl: MediaWithUrl | null = block.additionalMedia ? {
    ...block.additionalMedia,
    image: block.additionalMedia.image ? {
      ...block.additionalMedia.image,
      url: urlFor(block.additionalMedia.image.asset._ref).width(600).url()
    } : undefined,
    video: block.additionalMedia.video ? {
      ...block.additionalMedia.video,
      url: urlForVideo(block.additionalMedia.video.asset._ref).url()
    } : undefined,
  } : null;

  return {
    ...block,
    mainMedia: mainMediaWithUrl,
    additionalMedia: additionalMediaWithUrl
  }
}

const PRODUCT_PAGE_QUERY = async (slug: string) => {
  const query: Array<{
    store: {
      slug: string,
      id: string,
    },
    faq?: Array<{ question: string, answer: Array<Block> }>;
    modules: Array<ContentDescription | ContentBigTitle | ContentMoreInformation | ActionBlock>,
    page: ProductPage[] | null
  }> = await loadQuery(groq`*[_type == "product" && store.slug.current == "${slug}" ] {
    store {
      slug,
      id
    },
    modules,
    faq,
    "page": *[_type == "productPage"] {
    defaultInformation,
    bigTitle,
    "pins": pins[]{
      details,
      name,
      icon,
     "linkedProducts": linkedProducts[]->store.id
    }
  }
  }
  `);

  if (query.length === 0) return null;

  // parse pins 
  const pins = query[0].page?.[0].pins || [];

  return {
    ...query[0],
    modules: query[0].modules?.map((m) => m._type === "actionBlock" ? parseActionBlock(m) : m),
    faq: query[0].faq || [],
    page: query[0].page?.[0] || null,
    pins: pins.filter((p) => p.linkedProducts.includes(query[0].store.id))
  };
}

const GLOBAL_QUERY = async () => {
  const query: Array<Global> = await loadQuery(groq`*[_type == "global"]`);

  if (query.length === 0) return null;

  return query[0];
}

const FREE_ITEMS = { NAILS: 'nails', HAIR: 'hair' } as const;
const CART_QUERY = async (): Promise<CartModule | null> => {
  const query: Array<{
    filteredPins: Array<{
      name: string,
      _key: string,
      linkedProducts: Array<string>;
    }>
  }> = await loadQuery(groq`*[_type == "productPage"] {
    "filteredPins": pins[_key in ["526c0ca83474", "796834b43802"]] {
      name,
      _key,
      "linkedProducts":linkedProducts[]->store.id
    }
  }`);

  if (query.length === 0) return null;

  return {
    ...query[0],
    freeItems: query[0].filteredPins.map((p) => ({
      ...p,
      linkedProducts: p.linkedProducts.map((p) => p.toString()),
      gift: p._key === "526c0ca83474" ? FREE_ITEMS.NAILS : FREE_ITEMS.HAIR,
    }))
  }
}

const HOME_PAGE_QUERY = async () => {
  const query: Array<HomePage> = await loadQuery(groq`*[_type == "home"]{
    hero {
      carousel
    },
    cta,
    "productsSpotlight": productsSpotlight[].productWithVariant.product->{
      store {
        title,
        descriptionHtml,
        "slug": slug.current,
        priceRange,
        previewImageUrl
      }
    }
  }
  `);

  if (query.length === 0) return null;

  return {
    ...query[0],
    cta: parseActionBlock(query[0].cta),
    hero: {
      ...query[0].hero,
      carousel: {
        images: query[0].hero.carousel.map(image => ({
          ...image,
          url: urlFor(image.asset._ref).width(1024).url() as string
        }))
      }
    }
  }
}

const CART = {
  QUERY: CART_QUERY,
  FREE_ITEMS
}

export const CMS = {
  CART,
  PRODUCT_PAGE_QUERY,
  GLOBAL_QUERY,
  HOME_PAGE_QUERY,
  urlForImg: urlFor,
  urlForVideo
}