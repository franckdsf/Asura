import { useLoaderData, Link } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Pagination, getPaginationVariables, Image, AnalyticsPageType } from '@shopify/hydrogen';
import type { CollectionFragment } from 'storefrontapi.generated';
import { Card } from '~/ui/molecules';
import { COLLECTIONS_QUERY } from '~/queries';
import { ExtractCollection } from '~/components/collections';

export async function loader({ context, request }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const { collections } = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({
    collections,
    analytics: {
      pageType: AnalyticsPageType.listCollections,
      collections
    },
  });
}

export default function Collections() {
  const { collections } = useLoaderData<typeof loader>();

  return (
    <div className="collections">
      <div className="mt-24 mb-32 lg:mb-48">
        <h1 className="px-8 mb-24 text-3xl text-center uppercase lg:text-6xl font-accent">collections</h1>
        <Pagination connection={collections}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => (
            <ul className="flex flex-row flex-wrap items-start justify-center w-11/12 gap-8 mx-auto sm:gap-x-16 2xl:gap-x-32 gap-y-16 max-w-7xl">
              <ExtractCollection collections={nodes} filter="nos kits" />
              <ExtractCollection collections={nodes} filter="gels" />
              <ExtractCollection collections={nodes} filter="accessoires" />
              <ExtractCollection collections={nodes} filter="tout voir" />
            </ul>
          )}
        </Pagination>
      </div>
    </div>
  );
}



function CollectionsGrid({ collections }: { collections: CollectionFragment[] }) {
  return (
    <div className="collections-grid">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
        />
      )}
      <h5>{collection.title}</h5>
    </Link>
  );
}

