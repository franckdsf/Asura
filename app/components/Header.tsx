import { Await, NavLink, useMatches } from '@remix-run/react';
import { Suspense } from 'react';
import type { LayoutProps } from './Layout';
import { Icon, Link } from '@ui/atoms';
import logo from '../../public/assets/logo.png';
import { trim } from '@ui/utils/trim';
import { type Global } from '~/queries/sanity.types';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'> & { promotion?: { backgroundColor?: { hex: string }; text?: string; link?: string; } };

type Viewport = 'desktop' | 'mobile';

export function Header({ header, isLoggedIn, promotion, cart }: HeaderProps) {
  const { shop, menu } = header;

  return (
    <header className={trim(`bg-white sticky top-0 lg:border-b border-neutral-300 header-container`)}>
      {promotion && <div className="px-4 py-2 text-xs font-medium text-center text-white uppercase" style={{ backgroundColor: promotion.backgroundColor?.hex }}>
        {promotion.link ? <Link href={promotion.link} className="text-white flex-row-center">{promotion.text}<Icon.ArrowRight className="ml-4" /></Link> : <p>{promotion.text}</p>}
      </div>}
      <div className="relative flex flex-row items-center justify-between px-4 sm:px-10 header">
        <HeaderMenuMobileToggle />
        <HeaderMenu menu={menu} viewport="desktop" />
        <NavLink to="/"><img src={logo} alt="logo" className="absolute h-6 lg:h-10 inset-center" width="auto" /></NavLink>
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
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

  const filterMenus = ['Accueil', viewport === 'mobile' ? '' : 'Nous contacter', viewport === 'mobile' ? '' : 'Ma commande'].map((x) => x.toUpperCase())

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
        const extractItem = (element: Omit<typeof item, 'items'>, showCaret?: boolean) => {
          if (!element.url) return null;

          // if the url is internal, we strip the domain
          const url =
            element.url.includes('myshopify.com') ||
              element.url.includes(publicStoreDomain) || element.url // TODO REMOVE (|| element.url)
              ? new URL(element.url).pathname
              : element.url;

          return (
            <div key={element.id}>
              <NavLink
                className={`uppercase header-menu-item text-sm 2xl:text-md flex flex-row justify-start items-center`}
                end
                onClick={closeAside}
                prefetch="intent"
                style={activeLinkStyle}
                to={url}
              >
                {element.title}
                {showCaret && <Icon.CaretDown className="ml-2" />}
              </NavLink>
            </div>
          );
        }

        if (viewport === "mobile" && item.items.length > 0) {
          return <div key={item.id}>
            {extractItem(item, true)}
            <div className="flex flex-col items-start justify-start py-3 pl-4 mt-1 ml-2 border-l border-neutral-300 gap-y-3">
              {item.items.map((subItem) => {
                return extractItem(subItem);
              })}
            </div>
          </div>
        } else if (item.items.length > 0) {
          return <div key={item.id} className="relative bg-white group">
            {extractItem(item, true)}
            <div className={`absolute flex-col items-start justify-start hidden p-3 pr-8 pl-4 pt-4 bg-white
             group-hover:flex top-full gap-y-3`}>
              {item.items.map((subItem) => {
                return extractItem(subItem);
              })}
            </div>
          </div>
        }

        return extractItem(item);
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
        to="/pages/nous-contacter"
        className="mr-6 text-sm uppercase max-lg:hidden header-menu-item 2xl:text-md"
      >
        nous contacter
      </NavLink>
      <NavLink
        end
        prefetch="intent"
        style={activeLinkStyle}
        to="/apps/parcelpanel"
        className="mr-6 text-sm uppercase max-lg:hidden header-menu-item 2xl:text-md"
      >
        ma commande
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="p-2 border rounded-full lg:p-3 header-menu-mobile-toggle gap-x-2 border-neutral-300" href="#mobile-menu-aside"
      aria-label="menu toggle"
    >
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
