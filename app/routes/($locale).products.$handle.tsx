import { useEffect, useMemo, useRef } from 'react';
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import {
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
} from 'storefrontapi.generated';

import {
  Money,
  getSelectedProductOptions,
  getPaginationVariables,
  AnalyticsPageType,
} from '@shopify/hydrogen';
import type {
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import { getVariantUrl } from '~/utils';
import { BigText, DeliveryDate, DescriptionBlock, MoreInformation, ProductStickyATC, RecommendedProducts } from '~/components/products';
import { AddToCartButton } from '~/tracking/components';
import { CarouselProductImages } from '~/ui/organisms';
import { trim } from '~/ui/utils/trim';
import { Icon } from '~/ui/atoms';
import { type SwiperClass } from 'swiper/react';
import { CMS, COLLECTION_QUERY } from '~/queries';
import { SpecialOffer } from '~/ui/templates';

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const siteName = 'Asura';
  const title = data?.product.seo.title || `${data?.product.title} | ${siteName}`;
  const description = `${data?.product.seo.description || data?.product.description}`;

  return [
    { title },
    { description },
    { property: 'og:site_name', content: siteName },
    { property: 'og:url', content: location },
    { property: 'og:title', content: title },
    { property: 'og:type', content: 'product' },
    { property: 'og:description', content: description },
    { property: 'og:image', content: data?.product.images.nodes[0].url },
    { property: 'og:image:secure_url', content: data?.product.images.nodes[0].url },
    { property: 'og:image:width', content: data?.product.images.nodes[0].width },
    { property: 'og:image:height', content: data?.product.images.nodes[0].height },
    { property: 'og:image:amount', content: data?.product.selectedVariant?.price.amount },
    { property: 'og:image:currency', content: data?.product.selectedVariant?.price.currencyCode },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:title', content: title },
    { property: 'twitter:description', content: description },
  ];
};

export async function loader({ params, request, context }: LoaderFunctionArgs) {
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

  const productPage = await CMS.PRODUCT_PAGE_QUERY(handle);

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

  return defer({
    productPage,
    product,
    variants,
    recommendedProducts,
    analytics: {
      pageType: AnalyticsPageType.product,
      products: [product],
    },
  });
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
  const { productPage, product, variants, recommendedProducts } = useLoaderData<typeof loader>();
  const { selectedVariant } = product;

  useEffect(() => {
    if (swiper.current)
      swiper.current.slideToLoop(0);
  }, [selectedVariant]);

  const indexOfVariantInProductImages = product.images.nodes.findIndex((img) => img.url === selectedVariant?.image?.url);
  const defaultCarouselIndex = product.variants.nodes.length > 1 && indexOfVariantInProductImages !== 0 ? 1 : 0;

  const images = [
    selectedVariant?.image ? {
      src: selectedVariant.image.url,
      alt: selectedVariant.image.altText || '',
      width: selectedVariant.image.width || 500,
      height: selectedVariant.image.height || 500,
    } : undefined,
    ...product.images.nodes.map((img) => ({
      src: img.url,
      alt: img.altText || '',
      width: img.width || 500,
      height: img.height || 500,
    })).filter((img) => img.src !== selectedVariant?.image?.url),
  ].filter((img): img is ImageStructure => !!img)

  const modules = useMemo(() => {
    const baseModules = productPage?.modules || [];

    const showDefaultMoreInformation = !baseModules.some((m) => m._type === "module.content.moreInformation");
    const showDefaultBigTitle = baseModules.length > 0 ? baseModules[baseModules.length - 1]._type !== "module.content.bigTitle" : true;

    const defaultMoreInformation = {
      _type: "module.content.moreInformation",
      ...productPage?.page?.defaultInformation,
    } as const;

    const defaultBigTitle = productPage?.page ? {
      ...productPage.page.bigTitle,
      _type: "module.content.bigTitle",
    } as const : null;

    const modules = [...(baseModules || [])];

    if (defaultMoreInformation && showDefaultMoreInformation)
      modules.push(defaultMoreInformation);

    if (defaultBigTitle && showDefaultBigTitle)
      modules.push(defaultBigTitle);

    return modules;
  }, [productPage])

  return (
    <div>
      <div className="flex-row items-center justify-between lg:h-screen-w-header lg:border-b border-neutral-300 lg:flex">
        {selectedVariant?.image && <CarouselProductImages
          defaultIndex={defaultCarouselIndex}
          className="pt-4 lg:pt-10 lg:pb-[15vh] border-r border-neutral-300"
          getSwiper={(s) => swiper.current = s}
          images={images}
        />}
        {/* <ProductImage image={selectedVariant?.image} /> */}
        <ProductMain
          className="z-10 w-full lg:max-w-xl 2xl:max-w-3xl lg:px-24 2xl:px-32 lg:py-6 lg:-mt-16"
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
      </div>
      {modules.map((m) => {
        switch (m._type) {
          case "module.content.bigTitle":
            return <BigText
              key={JSON.stringify(m)}
              title={m.title}
              bigTitle={m.bigTitle}
              imageSrc={CMS.urlForImg(m.sideImage.asset._ref).width(200).url()}
              className="px-4 my-24 md:my-48 md:px-10"
            />
          case "module.content.description":
            return <DescriptionBlock
              key={JSON.stringify(m)}
              description={m.description}
              videoSrc={m.media?.video ? CMS.urlForVideo(m.media.video.asset._ref).url() : undefined}
              imageSrc={m.media?.image ? CMS.urlForImg(m.media.image.asset._ref).width(800).url() : product.images.nodes[0].url}
              list={(m.list?.map((i) => ({
                icon: i.icon,
                title: i.title,
                content: i.description,
              })) || [])}
              className="mt-16 md:mt-28"
            />
          case "module.content.moreInformation":
            return <MoreInformation
              key={JSON.stringify(m)}
              className="mb-16 md:my-32" showTitleOnMobile={false}
              delivery={m.delivery || productPage?.page?.defaultInformation.delivery}
              guaranty={m.guaranty || productPage?.page?.defaultInformation.guaranty}
              included={m.included}
            />
          case "actionBlock":
            return <SpecialOffer
              key={JSON.stringify(m)}
              type="right"
              showSectionTitle={false}
              catchPhrase={m.catchPhrase}
              title={m.title}
              content={m.content}
              mainMedia={{ imageSrc: m.mainMedia.image?.url, videoSrc: m.mainMedia.video?.url }}
              additionalMedia={m.additionalMedia ? { imageSrc: m.additionalMedia.image?.url, videoSrc: m.additionalMedia.video?.url } : undefined}
              cta={m.cta ? { link: m.cta.link, text: m.cta.text } : undefined}
            />
          default:
            return null;
        }
      })}
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
        {/* eslint-disable-next-line react/no-array-index-key */}
        {Array(5).fill(0).map((_, i) => <Icon.Star className="icon-xs text-[#FBC400]" weight="fill" key={i} />)}
      </div>
      <ProductPrice selectedVariant={selectedVariant} className="mb-2 max-lg:hidden" />
      <h1 className="uppercase text-md-semibold lg:text-lg-semibold">{title}</h1>
      <DeliveryDate className="mt-2 mb-5" />
      <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} className="text-md" />
      <div className="inline-flex px-4 py-2 mt-6 uppercase rounded-full bg-neutral-600 text-neutral-50 align-center gap-x-2">
        <Icon.Book />
        <span className="text-xs">ebook offert</span>
      </div>
      <AddToCartButton
        className="w-full lg:max-w-lg !py-4 mt-4 lg:mt-12"
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        product={{
          ...product,
          name: product.title,
          brand: product.vendor,
          price: selectedVariant!.price.amount,
          productGid: product.id,
          variantGid: selectedVariant!.id
        }}
      >
        {selectedVariant?.availableForSale ? 'Ajouter au panier' : 'Rupture de stock'}
      </AddToCartButton>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
  className = "",
}: {
  selectedVariant: ProductFragment['selectedVariant'];
  className?: string
}) {
  return (
    <div className={trim(`text-md-medium lg:text-lg-semibold ${className}`)}>
      {selectedVariant?.compareAtPrice ? (
        <>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s className="mr-1 lg:font-regular">
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
    variants(first: 2) {
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
