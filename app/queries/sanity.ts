import groq from "groq"
import { loadQuery, urlFor } from "sanity";
import type {
  ContentBigTitle, ContentMoreInformation, ContentDescription, ImageWithUrl,
  ActionBlock,
  HomePage,
  ProductPage
} from "./sanity.types";

const parseActionBlock = (block: ActionBlock) => {
  const mainImageWithUrl: ImageWithUrl = {
    ...block.mainImage,
    url: urlFor(block.mainImage.asset._ref).width(800).url() as string
  };
  const additionalImageWithUrl: ImageWithUrl | null = block.additionalImage ? {
    ...block.additionalImage,
    url: urlFor(block.additionalImage.asset._ref).width(200).url() as string
  } : null;


  return {
    ...block,
    mainImage: mainImageWithUrl,
    additionalImage: additionalImageWithUrl
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
  urlFor
}