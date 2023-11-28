import { Image, Money } from "@shopify/hydrogen"
import { useMemo } from "react"
import { trim } from "../utils/trim";
import { useRandomSeed } from "../hooks";
import type { ProductItemFragment } from 'storefrontapi.generated';
import { Link } from "../atoms";
import { useVariantUrl } from "~/utils";

type ProductProps = ProductItemFragment;
export const Product = ({ handle, priceRange, variants, featuredImage, title }: ProductProps) => {
  const variant = variants.nodes[0];
  const variantUrl = useVariantUrl(handle, variant.selectedOptions);

  return (
    <div className="w-full">
      <Link
        className="product-item"
        prefetch="intent"
        href={variantUrl}
      >
        {featuredImage && <Image data={featuredImage} className="object-cover w-full aspect-square bg-container-light" sizes="33vw" />}
        <span className="mt-2 uppercase text-2xs lg:text-md-semibold line-clamp-1 lg:mt-4">{title}</span>
        <Money className="mt-1 text-2xs lg:text-xs line-clamp-1" data={priceRange.minVariantPrice} />
      </Link>
    </div>
  )
}

type TemplateProps = { gap: string, products: Array<ProductProps> }

type TemplateInfo = {
  name: string;
  Component: (props: TemplateProps) => JSX.Element;
  elements: 1 | 2;
  rows: 1 | 2;
};

const TemplateBig = ({ products }: TemplateProps) => (
  <li className="w-full row-span-2">{products.length > 0 && <Product {...products[0]} />}</li>
)
const TEMPLATE_BIG: TemplateInfo = { Component: TemplateBig, name: 'TEMPLATE_BIG', elements: 1, rows: 2 };

const TemplateSpaceBottom = ({ products, gap }: TemplateProps) => (
  <ul className={trim(`grid grid-cols-2 ${gap} xl:row-span-2 w-full`)}>
    <li className="w-full">{products.length > 0 && <Product {...products[0]} />}</li>
    <li className="w-full">{products.length > 1 && <Product {...products[1]} />}</li>
  </ul>
)
const TEMPLATE_SPACE_BOTTOM: TemplateInfo = { Component: TemplateSpaceBottom, name: 'TEMPLATE_SPACE_BOTTOM', elements: 2, rows: 2 };

const TemplateSpaceRight = ({ products, gap }: TemplateProps) => (
  <ul className={trim(`grid grid-cols-2 w-full ${gap}`)}>
    <li className="w-full">{products.length > 0 && <Product {...products[0]} />}</li>
  </ul>
)
const TEMPLATE_SPACE_RIGHT: TemplateInfo = { Component: TemplateSpaceRight, name: 'TEMPLATE_SPACE_RIGHT', elements: 1, rows: 2 };

const Template2Cols = ({ products, gap }: TemplateProps) => (
  <ul className={trim(`grid grid-cols-2 w-full ${gap}`)}>
    <li className="w-full">{products.length > 0 && <Product {...products[0]} />}</li>
    <li className="w-full">{products.length > 1 && <Product {...products[1]} />}</li>
  </ul>
)
const TEMPLATE_2_COLS: TemplateInfo = { Component: Template2Cols, name: 'TEMPLATE_2_COLS', elements: 2, rows: 1 };

const TemplateOneOfTwo = ({ products, gap }: TemplateProps) => (
  <ul className={trim(`grid grid-cols-2 row-span-2 w-full ${gap}`)}>
    {/* Space right */}
    <ul className={trim(`grid col-span-2 grid-cols-2 w-full ${gap}`)}>
      <li className="w-full">{products.length > 0 && <Product {...products[0]} />}</li>
    </ul>
    {/* Space left */}
    <ul className={trim(`grid col-span-2 grid-cols-2 w-full ${gap}`)}>
      <li className="w-full col-start-2">{products.length > 1 && <Product {...products[1]} />}</li>
    </ul>
  </ul>
)
const TEMPLATE_ONE_OF_TWO: TemplateInfo = { Component: TemplateOneOfTwo, name: 'TEMPLATE_ONE_OF_TWO', elements: 2, rows: 2 };

const TemplateSpaceLeft = ({ products, gap }: TemplateProps) => (
  <ul className={trim(`grid grid-cols-2 w-full ${gap}`)}>
    <li className="w-full col-start-2">{products.length > 0 && <Product {...products[0]} />}</li>
  </ul>
)
const TEMPLATE_SPACE_LEFT: TemplateInfo = { Component: TemplateSpaceLeft, name: 'TEMPLATE_SPACE_LEFT', elements: 1, rows: 2 };

const CHUNKS_TEMPLATE_COMPLEX = [TEMPLATE_BIG, TEMPLATE_SPACE_RIGHT, TEMPLATE_BIG,
  TEMPLATE_2_COLS, TEMPLATE_ONE_OF_TWO, TEMPLATE_SPACE_LEFT] as const;
const CHUNKS_TEMPLATE_MINIMALIST = [TEMPLATE_BIG, TEMPLATE_2_COLS] as const;

type Props = {
  title: string;
  description?: string;
  className?: string;
  products: ProductItemFragment[];
}

export const Collection = ({ className = "", title, description, products }: Props) => {
  const gap = `gap-4 md:gap-8 lg:gap-16`;

  const { randomChunk, generateRandomNumber } = useRandomSeed();

  const chunks = useMemo(() => {
    const productsCopy = JSON.parse(JSON.stringify(products)) as typeof products;
    const data = randomChunk(productsCopy, title);

    const random = (number: number) => generateRandomNumber(`${title}${number}`)

    let previous2Chunk = '';
    let previousChunk = '';

    const CHUNKS_TEMPLATE = products.length > 8 ? CHUNKS_TEMPLATE_COMPLEX : CHUNKS_TEMPLATE_MINIMALIST;

    const chunks2Elements = CHUNKS_TEMPLATE.filter((c) => c.elements === 2);
    const chunks1Element = CHUNKS_TEMPLATE.filter((c) => c.elements === 1);

    // add a random template to each chunk, but avoid having the 2 previous chunk to have the same as the current one,
    // make sure it only select a chunks2Elements if the chunk is length 2, and chunks1Element if the chunk is length 1

    const generatedChunks = data.map((chunk, i) => {
      const isLength2 = chunk.length === 2;
      const isLength1 = chunk.length === 1;

      const templates = isLength2 ? chunks2Elements : isLength1 ? chunks1Element : CHUNKS_TEMPLATE;
      const filteredChunksTemplate = templates.filter((c) => c.name !== previousChunk && c.name !== previous2Chunk);
      const filteredChunksCleaned = filteredChunksTemplate.length > 0 ? filteredChunksTemplate : templates;

      // select a random number between 0 & filteredChunksTemplate.length using
      const randomIndex = Math.floor(random(i) * filteredChunksCleaned.length);
      const randomTemplate = filteredChunksCleaned[randomIndex];

      previous2Chunk = previousChunk;
      previousChunk = randomTemplate.name;

      return {
        chunk,
        template: randomTemplate
      }
    })

    const hasChunkOfLength2 = generatedChunks.some((c) => c.chunk.length > 1);
    if (hasChunkOfLength2) {
      let randomIndex = Math.floor(generatedChunks.length / 2);
      while (generatedChunks[randomIndex].chunk.length === 1) {
        randomIndex = Math.floor(random(randomIndex) * generatedChunks.length);
      }

      // break the chunk
      const chunkToBreak = generatedChunks[randomIndex];
      const chunkToBreakLength = chunkToBreak.chunk.length;
      const chunkToBreakTemplate = chunkToBreak.template;
      const newChunk = {
        chunk: chunkToBreak.chunk.slice(chunkToBreakLength - 1),
        template: chunkToBreakTemplate
      }
      chunkToBreak.chunk = chunkToBreak.chunk.slice(0, chunkToBreakLength - 1);
      generatedChunks.splice(randomIndex + 1, 0, newChunk);

    }

    // check if there is at least one TEMPLATE_BIG chunk in the chunks, if not, replace a chunk with length 1 by it
    const hasBigChunk = generatedChunks.some((c) => c.template.name === TEMPLATE_BIG.name);
    const indexOfChunkWithLength1 = generatedChunks.find((c) => c.chunk.length === 1);

    if (!hasBigChunk && indexOfChunkWithLength1) {
      indexOfChunkWithLength1.template = TEMPLATE_BIG;
    }

    return generatedChunks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  return (
    <div className={trim(`px-4 lg:px-10 ${className}`)}>
      <h1 className="mb-8 text-2xl uppercase md:text-4xl lg:text-7xl font-accent lg:mb-24">{title}</h1>
      {description && <p className="collection-description">{description}</p>}
      <ul className={trim(`grid grid-cols-1 xl:grid-cols-2 grid-flow-dense ${gap}`)}>
        {chunks.map((chunk, i) => {
          const { template, chunk: prods } = chunk;
          const { Component } = template;

          return (
            <Component key={chunk.template.name + prods.reduce((b, a) => b + a.title, '')} gap={gap} products={prods} />
          )
        })}
      </ul>
    </div>
  )
}