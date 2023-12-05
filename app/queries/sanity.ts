import groq from "groq"
import { DATASET, PROJECT_ID, loadQuery, urlFor } from "sanity";
import type {
  ContentBigTitle, ContentMoreInformation, ContentDescription, ImageWithUrl,
  ActionBlock,
  HomePage,
  ProductPage,
  MediaWithUrl
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
      url: urlFor(block.additionalMedia.image.asset._ref).width(1200).url()
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
    },
    modules: Array<ContentDescription | ContentBigTitle | ContentMoreInformation | ActionBlock>,
    page: ProductPage[] | null
  }> = await loadQuery(groq`*[_type == "product" && store.slug.current == "${slug}" ] {
    store {
      slug
    },
    modules,
    "page": *[_type == "productPage"]
  }
  `);

  if (query.length === 0) return null;
  return {
    ...query[0],
    modules: query[0].modules?.map((m) => m._type === "actionBlock" ? parseActionBlock(m) : m),
    page: query[0].page?.[0] || null,
  };
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

export const CMS = {
  PRODUCT_PAGE_QUERY,
  HOME_PAGE_QUERY,
  urlForImg: urlFor,
  urlForVideo
}