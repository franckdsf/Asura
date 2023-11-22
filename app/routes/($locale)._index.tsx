import { json, type LoaderArgs } from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Link,
  type V2_MetaFunction,
} from '@remix-run/react';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  CollectionQuery,
} from 'storefrontapi.generated';
import { Landing, ProductsSpotlight, SpecialOffer } from '@ui/templates';
import { Card } from '@ui/molecules';
import { CarouselProducts } from '@ui/organisms';
import { COLLECTION_QUERY } from '../queries';
import { RecommendedProducts } from '~/components/products';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }];
};

export async function loader({ context, request }: LoaderArgs) {
  const { storefront } = context;
  const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });

  const { collection: recommendedProducts } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle: 'recommended', ...paginationVariables },
  });

  return json({ featuredCollection, recommendedProducts });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Landing />
      <div className="mb-32 lg:mb-48 mt-24">
        <h1 className="text-3xl lg:text-6xl font-accent uppercase text-center mb-24 px-8">nos produits</h1>
        <ul className="flex flex-row justify-center items-start flex-wrap gap-8 sm:gap-x-16 2xl:gap-x-32 gap-y-16 max-w-7xl w-11/12 mx-auto">
          <li><Card.Category text="nos gels" /></li>
          <li><Card.Category text="nos coats" /></li>
          <li><Card.Category text="accessoires" /></li>
          <li><Card.Category text="nos produits" /></li>
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
