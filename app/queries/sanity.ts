import groq from "groq"
import { loadQuery, urlFor } from "sanity";
import type {
  ContentBigTitle, ContentMoreInformation, ContentDescription, ImageWithUrl,
  OfferBlock,
  HomePage,
  ProductPage
} from "./sanity.types";


const PRODUCT_PAGE_QUERY = async (slug: string) => {
  const query: Array<{
    store: {
      slug: string,
    },
    modules: Array<ContentDescription | ContentBigTitle | ContentMoreInformation>,
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
    page: query[0].page?.[0] || null,
  };
}

const OFFER_BLOCK_QUERY = async () => {
  const query: Array<OfferBlock> = await loadQuery(groq`*[_type == "offerBlock" ]`);

  if (query.length === 0) return null;

  const offerBlock = query[0];
  const mainImageWithUrl: ImageWithUrl = {
    ...offerBlock.mainImage,
    url: urlFor(offerBlock.mainImage.asset._ref).width(800).url() as string
  };
  const additionalImageWithUrl: ImageWithUrl | null = offerBlock.additionalImage ? {
    ...offerBlock.additionalImage,
    url: urlFor(offerBlock.additionalImage.asset._ref).width(200).url() as string
  } : null;


  return {
    ...offerBlock,
    mainImage: mainImageWithUrl,
    additionalImage: additionalImageWithUrl
  }
}

const HOME_PAGE_QUERY = async () => {
  const query: Array<HomePage> = await loadQuery(groq`*[_type == "home"]{
    hero {
      carousel
    },
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
  OFFER_BLOCK_QUERY,
  urlFor
}