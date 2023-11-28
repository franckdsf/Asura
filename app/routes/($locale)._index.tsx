import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Link,
  type MetaFunction,
} from '@remix-run/react';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  CollectionQuery,
} from 'storefrontapi.generated';
import { Landing, ProductsSpotlight, SpecialOffer } from '@ui/templates';
import { Card } from '@ui/molecules';
import { CarouselProducts } from '@ui/organisms';
import { COLLECTION_QUERY, COLLECTIONS_QUERY } from '../queries';
import { RecommendedProducts } from '~/components/products';
import { ExtractCollection } from '~/components/collections';

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: 'Hydrogen | Home' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { storefront } = context;
  const { collections: collectionsTmp } = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collectionsTmp.nodes[0];

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });


  const { collection: recommendedProducts } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle: 'recommended', ...paginationVariables },
  });


  const { collections } = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({ collections, featuredCollection, recommendedProducts });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Landing />
      <div className="mt-24 mb-32 lg:mb-48">
        <h1 className="px-8 mb-24 text-3xl text-center uppercase lg:text-6xl font-accent">nos produits</h1>
        <ul className="flex flex-row flex-wrap items-start justify-center w-11/12 gap-8 mx-auto sm:gap-x-16 2xl:gap-x-32 gap-y-16 max-w-7xl">
          <ExtractCollection collections={data.collections.nodes} filter="nos kits" />
          <ExtractCollection collections={data.collections.nodes} filter="gels" />
          <ExtractCollection collections={data.collections.nodes} filter="accessoires" />
          <ExtractCollection collections={data.collections.nodes} filter="tout voir" />
        </ul>
      </div>
      <SpecialOffer
        cta={{ link: '/', text: 'shop now' }}
      />
      <ProductsSpotlight />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      {data.recommendedProducts && <RecommendedProducts collection={data.recommendedProducts} />}
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}


const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
