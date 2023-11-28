import { Link } from "@remix-run/react";
import { type CollectionFragment } from "storefrontapi.generated";
import { Card } from "~/ui/molecules";

export const ExtractCollection = ({ collections, filter }: { filter: string, collections: CollectionFragment[] }) => {
  const collection = collections.find((c) => c.title.toUpperCase() === filter.toUpperCase())
  if (!collection) return null;

  const img = Object.assign({}, collection?.image);
  delete img.altText;

  return (
    <li>
      <Link
        to={`/collections/${collection.handle}`}
      >
        <Card.Category text={collection?.title} image={{
          ...img,
          alt: img?.altText || undefined,
          id: undefined,
          src: img?.url,
          width: img?.width || 200,
          height: img?.height || 300,
        }} />
      </Link>
    </li>
  )
}