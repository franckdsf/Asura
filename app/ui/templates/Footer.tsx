import { useMatches, Link } from '@remix-run/react';
import type { FooterQuery } from 'storefrontapi.generated';
import { trim } from '@ui/utils/trim';
import logo from '../../../public/assets/logo-hd.png';
import { Icon } from '../atoms';
import { Newsletter } from './Newsletter';

export function Footer({ menu }: FooterQuery) {
  return (
    <footer className="pb-16 mt-16 footer ">
      <Newsletter />
      <div className="relative w-full my-24 h-1px bg-neutral-600">
        <div className="relative inline-flex p-4 bg-white border rounded-full inset-center border-neutral-600">
          <Icon.Gavel className="icon-sm text-neutral-600" />
        </div>
      </div>
      <FooterMenu menu={menu} />
    </footer>
  );
}

type DefaultProps = {
  className?: string;
  title: string;
  links: Array<{ url?: string, label: string, external?: boolean } | null>
}
const FooterSection = ({ className = '', title, links }: DefaultProps) => {
  return (
    <div className={trim(`${className}`)}>
      <h6 className="text-[20px] lg:text-3xl uppercase text-neutral-600 font-accent mb-2 lg:mb-6">{title}</h6>
      <ul className="text-xs lg:text-lg">
        {links.filter((l) => l).map((link) => (
          <li key={link!.label} className="mb-1">{link?.url ? <Link to={link.url}>{link!.label}</Link> : link!.label}</li>
        ))}
      </ul>
    </div>
  )
}

function FooterMenu({ menu }: Pick<FooterQuery, 'menu'>) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;

  const currentYear = new Date().getFullYear();

  return (
    <nav className="px-4 sm:px-20" role="navigation">
      <FooterSection
        className="mb-8 lg:mb-24"
        title="liens utiles"
        links={[
          { url: '/', label: 'Asura' },
          { url: '/pages/nous-contacter', label: 'Nous contacter' }
        ]}
      />
      <FooterSection
        className="mb-8 lg:mb-24"
        title="liens utiles"
        links={(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url) return null;
          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return { url, label: item.title, external: isExternal }
        })}
      />
      <FooterSection
        className="mb-16 lg:mb-24 xl:mb-32"
        title="informations"
        links={[
          { label: '+33 7 56 93 97 04 (du lundi au vendredi, de 9h à 17h)' },
          { label: '12 rue de la Part Dieu, 69003, Lyon' }
        ]}
      />
      <div className="flex flex-col justify-between sm:flex-row sm:items-end">
        <img src={logo} alt="logo" className="w-4/6 max-w-4xl" width={836} height={175} />
        <p className="text-xs max-sm:mt-6 max-sm:text-right sm:text-lg text-neutral-600">© {currentYear} Asura</p>
      </div>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
