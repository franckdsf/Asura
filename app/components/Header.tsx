import { Await, NavLink, useMatches } from '@remix-run/react';
import { Suspense } from 'react';
import type { LayoutProps } from './Layout';
import { Icon } from '@ui/atoms';
import { Image } from '@shopify/hydrogen';
import logo from '../../public/assets/logo.png';
import { useScrollDirection } from '@ui/hooks';
import { trim } from '@ui/utils/trim';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({ header, isLoggedIn, cart }: HeaderProps) {
  const { shop, menu } = header;

  const { scrollPosition } = useScrollDirection();

  return (
    <header className={trim(`${scrollPosition > 0 && 'bg-white'} sticky flex flex-row items-center justify-between px-4 sm:px-10 header lg:border-b border-neutral-300`)}>
      <HeaderMenuMobileToggle />
      <HeaderMenu menu={menu} viewport="desktop" />
      <NavLink to="/"><img src={logo} alt="logo" className="absolute h-6 lg:h-10 inset-center" width="auto" /></NavLink>
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  viewport: Viewport;
}) {
  const [root] = useMatches();
  const publicStoreDomain = (root?.data as { publicStoreDomain: string })?.publicStoreDomain;
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  const filterMenus = ['Accueil', viewport === 'mobile' ? '' : 'Ma commande'].map((x) => x.toUpperCase())

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (<>
        <NavLink
          end
          className="uppercase"
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      </>
      )}
      {menu?.items.filter((i) => !filterMenus.includes(i.title.toUpperCase())).map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            className="uppercase header-menu-item text-md"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      {/* <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink> */}
      {/* <SearchToggle /> */}
      <NavLink
        end
        prefetch="intent"
        style={activeLinkStyle}
        to="/apps/parcelpanel"
        className="mr-6 uppercase max-lg:hidden header-menu-item text-md"
      >
        ma commande
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="p-2 border rounded-full lg:p-3 header-menu-mobile-toggle gap-x-2 border-neutral-300" href="#mobile-menu-aside" >
      <h3><Icon.List className="icon-md lg:icon-lg" /></h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

function CartBadge({ count }: { count: number }) {
  return <a href="#cart-aside" className="p-2 text-xs border rounded-full lg:text-md lg:p-3 flex-row-center gap-x-2 border-neutral-300">
    <Icon.ShoppingBag className="icon-md lg:icon-lg" /> {count}
  </a>;
}

function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
