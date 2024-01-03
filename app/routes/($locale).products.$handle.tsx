import { Suspense, useEffect, useMemo, useRef } from 'react';
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import {
  useLoaderData,
  type MetaFunction,
  useRouteLoaderData,
  Await,
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
  parseGid,
} from '@shopify/hydrogen';
import type {
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import { getVariantUrl } from '~/utils';
import {
  BigText, DeliveryDate, DescriptionBlock, ItemsLeft, JudgeMeReviewStars, JudgeMeReviews,
  MoreInformation, ProductStickyATC, RecommendedProducts, VariantSelector, useJudgeMe
} from '~/components/products';
import { AddToCartButton } from '~/tracking/components';
import { BulletsBand, CarouselProductImages, TablePoints } from '~/ui/organisms';
import { trim } from '~/ui/utils/trim';
import { type SwiperClass } from 'swiper/react';
import { CMS, COLLECTION_QUERY } from '~/queries';
import { CallToAction } from '~/ui/templates';
import { Accordion, Pin } from '~/ui/molecules';
import { type rootLoader } from '~/root';
import { useGoogleEvents } from '~/tracking/hooks';
import { useProduct } from '~/components/products/useProduct';
import { STORE } from '~/store.info';
import type { ContentMoreInformation, ContentTablePoints } from '~/queries/sanity.types';

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const siteName = STORE.name;
  const title = data?.product.seo.title || `${data?.product.title} | ${siteName}`;
  const description = `${data?.product.seo.description || data?.product.description}`;

  return [
    { title },
    { name: "description", content: description },
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const productPage = await CMS.PRODUCT_PAGE_QUERY(handle);
  const options = (productPage?.store.options || []).map((o) => o.name);

  const selectedOptions = getSelectedProductOptions(request)
    .filter((option) => options.includes(option.name));

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
  const rootLoader = useRouteLoaderData<rootLoader>('root');
  const { setHasVariants, setProductId } = useProduct();
  const { selectedVariant } = product;

  const hasSideElements = productPage ? productPage.additionalDescriptionBlocks.length > 0 : false;

  // send an item view event to google everytime the item changes
  const { sendItemViewEvent } = useGoogleEvents();
  useEffect(() => {
    if (!product.selectedVariant) return;

    setHasVariants(product.variants.nodes.length > 1);
    setProductId(product.id);

    sendItemViewEvent({
      payload: {
        product: {
          productId: parseGid(product.id).id,
          variantId: parseGid(product.selectedVariant.id).id,
          // brand: product.vendor, // TODO add vendor
          name: product.title,
          discount: 0, // TODO add discount
          quantity: 1,
          price: product.selectedVariant.price.amount,
          currency: product.selectedVariant.price.currencyCode,
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => { setHasVariants(false); setProductId(null); }, [])

  useJudgeMe();

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

    const hasMoreInformationOnSideDescription = productPage?.additionalDescriptionBlocks.some((m) => m._type === 'module.content.moreInformation');
    const showDefaultBulletsBand = !baseModules.some((m) => m._type === 'module.content.tablePoints');
    const showDefaultMoreInformation = !baseModules.some((m) => m._type === "module.content.moreInformation")
      && !hasMoreInformationOnSideDescription;
    const showDefaultBigTitle = baseModules.length > 0 ? baseModules[baseModules.length - 1]._type !== "module.content.bigTitle" : true;

    const defaultBulletsBand = productPage?.page?.bulletsBand;

    const defaultMoreInformation = {
      _type: "module.content.moreInformation",
      ...productPage?.page?.defaultInformation,
    } as const;

    const defaultBigTitle = productPage?.page ? {
      ...productPage.page.bigTitle,
      _type: "module.content.bigTitle",
    } as const : null;

    const modules: typeof baseModules = [];

    if (defaultMoreInformation && showDefaultMoreInformation)
      modules.push(defaultMoreInformation);

    modules.push(...(baseModules || []));

    if (defaultBigTitle && showDefaultBigTitle)
      modules.push(defaultBigTitle);

    if (defaultBulletsBand && showDefaultBulletsBand)
      // modules.splice(hasMoreInformationOnSideDescription ? 0 : 1, 0, defaultBulletsBand);
      modules.push(defaultBulletsBand);

    return modules;
  }, [productPage])

  return (
    <div>
      <div className={trim(`flex-row ${hasSideElements ? 'items-start' : 'items-center'} justify-between lg:border-b border-neutral-300 lg:flex`)}>
        {selectedVariant?.image && <CarouselProductImages
          defaultIndex={defaultCarouselIndex}
          className={trim(`pt-4 lg:pt-6 xl:pt-10 lg:pb-[15vh] xl:pb-[13vh] border-r border-neutral-300 lg:sticky lg:top-header lg:h-screen-w-header`)}
          getSwiper={(s) => swiper.current = s}
          images={images}
        />}
        {/* <ProductImage image={selectedVariant?.image} /> */}
        <ProductMain
          className={trim(`z-10 w-full max-w-xl max-lg:mx-auto xl:max-w-2xl 2xl:max-w-3xl lg:px-16 pb-6
            2xl:px-32 ${hasSideElements ? 'lg:py-16 md:pb-24 lg:sticky lg:top-header' : 'lg:py-6 lg:-mt-16'}`)}
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
          modules={productPage?.additionalDescriptionBlocks.map((m) => {
            switch (m._type) {
              case 'module.content.moreInformation':
                return {
                  ...m,
                  delivery: m.delivery || productPage?.page?.defaultInformation.delivery,
                  guaranty: m.guaranty || productPage?.page?.defaultInformation.guaranty,
                  included: m.included
                }
              default:
                return m;
            }
          })}
          pins={productPage?.pins}
          showDescription={productPage?.showShopifyDescription}
        />
      </div>
      {modules.map((m, i, n) => {
        switch (m._type) {
          case "module.content.bigTitle":
            return <BigText
              key={JSON.stringify(m)}
              title={m.title}
              bigTitle={m.bigTitle}
              imageSrc={CMS.urlForImg(m.sideImage.asset._ref).width(400).url()}
              showDesktopImage={i === modules.length - 1}
              className="px-4 my-24 md:my-48 md:px-10"
            />
          case "module.content.description":
            return <DescriptionBlock
              key={JSON.stringify(m)}
              description={m.description}
              videoSrc={m.media?.video ? CMS.urlForVideo(m.media.video.asset._ref).url() : undefined}
              imageSrc={m.media?.image ? CMS.urlForImg(m.media.image.asset._ref).width(800).url() : product.images.nodes[0].url}
              title={m.title}
              list={(m.list?.map((i) => ({
                icon: i.icon,
                title: i.title,
                content: i.description,
              })) || [])}
              className="mt-16 md:mt-28"
            />
          case "module.content.tablePoints":
            return <BulletsBand
              items={m.list.map((i) => ({
                icon: i.media.icon,
                imgSrc: i.media.image ? CMS.urlForImg(i.media.image.asset._ref).width(400).url() : undefined,
                title: i.title,
                description: i.description,
              }))}
              key={JSON.stringify(m)}
              className={`my-16 md:my-32`}
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
            return <CallToAction
              key={JSON.stringify(m)}
              type={n[i + 1] && n[i + 1]._type === "module.content.description" ? "center" : "right"}
              imagePosition="right"
              showSectionTitle={false}
              catchPhrase={m.catchPhrase}
              title={m.title}
              content={m.content}
              mainMedia={{ imageSrc: m.mainMedia.image?.url, videoSrc: m.mainMedia.video?.url }}
              additionalMedia={m.additionalMedia ? { imageSrc: m.additionalMedia.image?.url, videoSrc: m.additionalMedia.video?.url } : undefined}
              cta={m.cta && m.cta.link ? { link: m.cta.link, text: m.cta.text } : (m.cta ?
                <AddToCartButton
                  openCart={true}
                  disabled={!selectedVariant || !selectedVariant.availableForSale}
                  product={{
                    ...product,
                    name: product.title,
                    brand: product.vendor,
                    price: selectedVariant!.price.amount,
                    productGid: product.id,
                    variantGid: selectedVariant!.id
                  }}>
                  {selectedVariant?.availableForSale ? m.cta.text : 'Rupture de stock'}
                </AddToCartButton>
                : undefined)}
            />
          default:
            return null;
        }
      })}
      {recommendedProducts && <RecommendedProducts
        collection={recommendedProducts}
        title={{ class: "text-neutral-600" }}
        className="mb-12"
      />}
      {(productPage?.faq.length || 0) > 0 && <div className="px-4 mx-auto mb-12 lg:mt-24 sm:px-10 max-w-8xl sm:mb-24">
        <h1 className="text-2xl text-center uppercase sm:text-6xl font-accent">Questions fréquentes</h1>
        <div className="p-4 pt-3 mt-12 border sm:p-8 sm:mt-24 border-neutral-300">
          {productPage?.faq.map((f) => (
            <Accordion
              key={f.question}
              className="mt-8"
              title={f.question}
              content={f.answer}
            />
          ))}
        </div>
      </div>}
      <JudgeMeReviews productId={product.id} className="px-4 mb-12 md:mb-24 max-w-7xl" />
      <ProductStickyATC
        // className="mb-12 md:mb-24"
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
        promotion={rootLoader?.global?.enablePromotion ? rootLoader?.global?.promotion?.name : undefined}
      />
    </div>
  );
}

function ProductMain({
  className = '',
  selectedVariant,
  product,
  variants,
  pins,
  modules,
  showDescription = true,
}: {
  className?: string,
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
  showDescription?: boolean;
  modules?: Array<ContentTablePoints | ContentMoreInformation>;
  pins: Array<{ name: string, icon?: string, details?: string }> | undefined;
}) {
  const { title, descriptionHtml } = product;

  const hasDiscount = !!selectedVariant?.compareAtPrice;
  return (
    <div className={trim(`px-4 mt-6 ${className}`)}>
      <JudgeMeReviewStars productId={product.id} className="mb-3" />
      <ProductPrice selectedVariant={selectedVariant} className="mb-2" />
      <h1 className="mb-3 uppercase text-md-semibold lg:text-lg-semibold">{title}</h1>
      <DeliveryDate className="!inline-flex mt-2 mb-4" type="date" />
      {modules && modules.map((m) => {
        switch (m._type) {
          case "module.content.tablePoints":
            return <TablePoints
              items={m.list.map((i) => ({
                icon: i.media.icon,
                imgSrc: i.media.image ? CMS.urlForImg(i.media.image.asset._ref).width(32).url() : undefined,
                title: i.title,
                description: i.description,
              }))}
              key={JSON.stringify(m)}
              className="mb-6"
            />
          default:
            return null;
        }
      })}
      {showDescription && <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} className="pr-2 mb-2 text-justify" />}
      {pins && <div className="flex flex-row items-center justify-start gap-x-2">
        {pins.map((p) => <Pin title={p.name} icon={p.icon} details={p.details} key={p.name} />)}
      </div>}
      {hasDiscount && <ItemsLeft className="my-6" id={product.id} />}
      <form className={trim(`relative w-full ${pins ? 'mt-4' : 'mt-6'} lg:mt-10 mb-4`)} onSubmit={(e) => e.preventDefault()}>
        <Suspense fallback={null}>
          <Await resolve={variants}>
            {(v) => <VariantSelector
              popUp={{ scheme: 'dark', className: `bottom-14` }}
              className="w-full !py-2.5"
              options={product.options}
              handle={product.handle}
              variants={v.product?.variants.nodes || []}
            />}
          </Await>
        </Suspense>
      </form>
      <AddToCartButton
        className={trim(`w-full lg:max-w-xl !py-4`)}
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        showPaymentMethods={true}
        openCart={true}
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
      {modules && modules.map((m) => {
        switch (m._type) {
          case "module.content.moreInformation":
            return <MoreInformation.Small
              key={JSON.stringify(m)}
              className="mt-8"
              delivery={m.delivery}
              guaranty={m.guaranty}
              included={m.included}
            />
          default:
            return null;
        }
      })}
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

  const discountPercent = Math.round(100 * (selectedVariant?.compareAtPrice ? ((Number(selectedVariant?.compareAtPrice.amount) - Number(selectedVariant.price.amount))
    / Number(selectedVariant?.compareAtPrice.amount)) : 0));

  return (
    <div className={trim(`text-md-medium lg:text-lg-semibold ${className}`)}>
      {selectedVariant?.compareAtPrice ? (
        <>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s className="mr-1 lg:font-regular">
              <Money data={selectedVariant.compareAtPrice} />
            </s>
            <div className="-mt-0.5 px-2 py-0.5 text-2xs uppercase text-primary-on bg-primary-500 !leading-[unset] rounded-xs">
              promo -{discountPercent}%
            </div>
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
