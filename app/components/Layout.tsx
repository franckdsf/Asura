import { Await } from '@remix-run/react';
import { Suspense, useMemo } from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
  UpsellProductQuery,
} from 'storefrontapi.generated';
import { Aside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header, HeaderMenu } from '~/components/Header';
import { CartMain } from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import { type CMS } from '~/queries';
import { type CartModule } from '~/queries/sanity.types';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  upsells: Promise<Array<UpsellProductQuery | null>> | undefined;
  cartModule: Promise<CartModule | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  global: Awaited<ReturnType<typeof CMS.GLOBAL_QUERY>>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({
  upsells,
  cart,
  cartModule,
  children = null,
  footer,
  global,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <>
      <CartAside cart={cart} modules={cartModule} upsells={upsells} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} promotion={global?.enablePromotion ? global.promotion?.header : undefined} />
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} />}
        </Await>
      </Suspense>
    </>
  );
}

function CartAside({ cart, upsells, modules }: { upsells: LayoutProps['upsells'], cart: LayoutProps['cart'], modules: LayoutProps['cartModule'] }) {
  return (
    <Aside id="cart-aside" heading="panier">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={modules}>
          {(m) => (
            <Suspense fallback={<div>Loading cart...</div>}>
              <Await resolve={cart}>
                {(c) => <CartMain cart={c} modules={m} layout="aside" upsells={upsells} />}
              </Await>
            </Suspense>
          )}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({ fetchResults, inputRef }) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button type="submit">Search</button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

function MobileMenuAside({ menu }: { menu: HeaderQuery['menu'] }) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu menu={menu} viewport="mobile" />
    </Aside>
  );
}
