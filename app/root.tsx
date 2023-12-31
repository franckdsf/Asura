import { useNonce } from '@shopify/hydrogen';
import { defer, type MetaFunction, type LoaderFunctionArgs, json } from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import type { CustomerAccessToken } from '@shopify/hydrogen/storefront-api-types';
import type { HydrogenSession } from '../server';
import favicon from '../public/favicon.png';
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';
import { Layout } from '~/components/Layout';
import tailwindCss from './styles/tailwind.css';
/* @ts-ignore */
import swiperCss from 'swiper/css';
import { BodyPixel, useShopifyPixel, HeadPixel } from './tracking/pixels';
import { useShopId } from './tracking/hooks';
import { CMS } from './queries';
import { Tidio } from './components/Tidio';
import { useEffect } from 'react';
import { Link } from './ui/atoms';
import { UPSELL_PRODUCT_QUERY } from './queries/upsell';

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    { rel: 'stylesheet', href: tailwindCss },
    { rel: 'stylesheet', href: resetStyles },
    { rel: 'stylesheet', href: appStyles },
    { rel: 'stylesheet', href: swiperCss },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
  ];
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, session, cart } = context;
  const customerAccessToken = await session.get('customerAccessToken');
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  // validate the customer access token is valid
  const { isLoggedIn, headers } = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();
  const cartCMS = CMS.CART.QUERY();

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  });

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  const global = await CMS.GLOBAL_QUERY();
  const header = await headerPromise;

  // defer upsell
  const upsells = global?.upsells ? Promise.all(global.upsells.map((u) => storefront.query(UPSELL_PRODUCT_QUERY, {
    variables: { handle: u.store.slug }
  }))) : undefined;

  const NODE_ENV: 'production' | 'development' = (context.env as any).NODE_ENV || 'production';

  return defer(
    {
      analytics: {
        shopId: header.shop.id,
      },
      shopId: header.shop.id,
      meta: [{ title: header.shop.name },
      { name: "description", content: header.shop.description },
      { property: "og:site_name", content: header.shop.name },
      { property: "og:url", content: publicStoreDomain },
      { property: "og:title", content: header.shop.name },
      { property: "og:image", content: header.shop.brand?.logo?.image?.url },
      { property: "og:image:secure_url", content: header.shop.brand?.logo?.image?.url },
      { property: "og:image:width", content: "836" },
      { property: "og:image:height", content: "175" }],
      NODE_ENV,
      upsells,
      cart: cartPromise,
      cartModule: cartCMS,
      footer: footerPromise,
      global,
      header: { ...header, ...global },
      isLoggedIn,
      publicStoreDomain,
    },
    { headers },
  );
}

export type rootLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [...data?.meta || []]
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();

  useShopId(data.shopId);
  useShopifyPixel({ shopId: data.shopId });

  return (
    <html lang="fr">
      <head>
        <HeadPixel environment={data.NODE_ENV} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="google-site-verification" content="tC-eTfj_wAb60oZ3b2Trc4yiR1PiK5p3hS0kjv3V8Ks" />
        <Meta />
        <Links />
        <Tidio />
      </head>
      <body>
        <BodyPixel environment={data.NODE_ENV} />
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const [root] = useMatches();
  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <Tidio />
      </head>
      <body>
        <Layout {...root.data as any}>
          <div className="py-32 text-center route-error">
            <h1 className="text-3xl font-accent">Oops erreur {errorStatus} 🫣</h1>
            {errorMessage && (
              <fieldset>
                <pre>{errorMessage}</pre>
              </fieldset>
            )}
            <Link href="/" underline>Retourner à l&apos;accueil</Link>
          </div>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```js
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 * );
 * ```
 */
async function validateCustomerAccessToken(
  session: HydrogenSession,
  customerAccessToken?: CustomerAccessToken,
) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return { isLoggedIn, headers };
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return { isLoggedIn, headers };
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
