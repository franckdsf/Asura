import { Link } from "@remix-run/react";
import { CollectionFragment } from "storefrontapi.generated";
import { Card } from "~/ui/molecules";

export const ExtractCollection = ({ collections, filter }: { filter: string, collections: CollectionFragment[] }) => {
  const collection = collections.find((c) => c.title.toUpperCase() === filter.toUpperCase())
  if (!collection) return null;

  const img = collection?.image;
  return (
    <li>
      <Link
        to={`/collections/${collection.handle}`}
      >
        <Card.Category text={collection?.title} image={{
          ...img,
          id: undefined,
          src: img?.url,
          width: img?.width || 200,
          height: img?.height || 300,
        }} />
      </Link>
    </li>
  )
}