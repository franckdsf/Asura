import { Suspense, useEffect, useRef } from 'react';
import { defer, redirect, type LoaderArgs } from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  type V2_MetaFunction,
  type FetcherWithComponents,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
  getPaginationVariables,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import { getVariantUrl } from '~/utils';
import { AddToCartButton, BigText, DeliveryDate, DescriptionBlock, MoreInformation, ProductStickyATC, RecommendedProducts } from '~/components/products';
import { CarouselProductImages } from '~/ui/organisms';
import { trim } from '~/ui/utils/trim';
import { Icon } from '~/ui/atoms';
import { SwiperClass } from 'swiper/react';
import { COLLECTION_QUERY } from '~/queries';
import { SpecialOffer } from '~/ui/templates';

export const meta: V2_MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data.product.title}` }];
};

export async function loader({ params, request, context }: LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;


  // recommended products
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });
  const { collection: recommendedProducts } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle: 'recommended', ...paginationVariables },
  });

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      return redirectToFirstVariant({ product, request });
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: { handle },
  });

  return defer({ product, variants, recommendedProducts });
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  throw redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

type ImageStructure = { src: string, alt: string, width: number, height: number }
export default function Product() {
  const swiper = useRef<SwiperClass>();
  const { product, variants, recommendedProducts } = useLoaderData<typeof loader>();
  const { selectedVariant } = product;

  useEffect(() => {
    if (swiper.current)
      swiper.current.slideToLoop(product.images.nodes.length);
  }, [selectedVariant]);


  const images = [
    ...product.images.nodes.map((img) => ({
      src: img.url,
      alt: img.altText || '',
      width: img.width || 500,
      height: img.height || 500,
    })).filter((img) => img.src !== selectedVariant?.image?.url),
    selectedVariant?.image ? {
      src: selectedVariant.image.url,
      alt: selectedVariant.image.altText || '',
      width: selectedVariant.image.width || 500,
      height: selectedVariant.image.height || 500,
    } : undefined,
  ].filter((img): img is ImageStructure => !!img)

  return (
    <div>
      <div className="lg:h-screen-w-header lg:bg-container-light">
        {selectedVariant?.image && <CarouselProductImages
          defaultIndex={0}
          className="pt-4 lg:pb-[15vh]"
          getSwiper={(s) => swiper.current = s}
          images={images}
        />}
        {/* <ProductImage image={selectedVariant?.image} /> */}
        <ProductMain
          className="z-10 lg:absolute bottom-24 left-0 lg:bg-container-light w-full lg:max-w-md xl:max-w-xl lg:px-10 lg:py-6"
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
      </div>
      <DescriptionBlock className="mt-16 md:mt-28" />
      <MoreInformation className="mb-16 md:my-32" showTitleOnMobile={false} />
      <SpecialOffer
        type="right"
        showSectionTitle={false}
      />
      <BigText className="my-24 md:my-48 px-4 md:px-10" />
      {recommendedProducts && <RecommendedProducts collection={recommendedProducts} title={{ class: "text-neutral-600" }} />}
      <ProductStickyATC
        className="mt-12"
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
      />
    </div>
  );
}

function ProductMain({
  className = '',
  selectedVariant,
  product,
  variants,
}: {
  className?: string,
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const { title, descriptionHtml } = product;
  return (
    <div className={trim(`px-4 mt-6 ${className}`)}>
      <div className="flex mb-3 max-lg:hidden">
        {Array(5).fill(0).map((_, i) => <Icon.Star className="icon-xs text-[#FBC400]" weight="fill" key={i} />)}
      </div>
      <h1 className="uppercase text-md-semibold lg:text-lg-semibold">{title}</h1>
      <DeliveryDate className="mt-2 mb-5" />
      <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} className="text-md" />
      <div className="mt-6 uppercase px-4 py-2 rounded-full bg-neutral-600 text-neutral-50 inline-flex align-center gap-x-2">
        <Icon.Book />
        <span className="text-xs">ebook offert</span>
      </div>
      <AddToCartButton
        className="w-full !py-4 mt-4 lg:hidden"
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Ajouter au panier' : 'Rupture de stock'}
      </AddToCartButton>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 250) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
