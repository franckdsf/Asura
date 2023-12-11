import { type CollectionQuery } from "storefrontapi.generated";
import { CarouselProducts } from "@ui/organisms";
import { trim } from "@ui/utils/trim";

export function RecommendedProducts({
  collection,
  title,
  className,
}: {
  className?: string;
  collection: Required<CollectionQuery['collection']>;
  title?: {
    class?: string;
  }
}) {
  return (
    <div className={`mx-auto max-w-8xl ${className}`}>
      <h2 className={trim(`text-2xl xs:text-3xl lg:text-6xl font-accent uppercase mb-10 md:mb-24 text-center px-4 ${title?.class}`)}>Recommandés</h2>
      <CarouselProducts products={collection!.products.nodes.map((p) => ({
        id: p.id,
        name: p.title,
        link: `/products/${p.handle}`,
        price: p.priceRange.minVariantPrice,
        compareAtPrice: p.variants.nodes[0]?.compareAtPrice || undefined,
        img: p.featuredImage!,
      }))} />
      <br />
    </div>
  );
}