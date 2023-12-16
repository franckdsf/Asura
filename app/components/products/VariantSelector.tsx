import { VariantSelector as HydrogenVariantSelector, type VariantOption } from "@shopify/hydrogen"
import { type ProductOption } from "@shopify/hydrogen/storefront-api-types"
import { type ComponentProps, useState } from "react"
import { Icon, Link } from "~/ui/atoms"
import { useClickOutside } from "~/ui/hooks"
import { trim } from "~/ui/utils/trim"

type Props = {
  options: ComponentProps<typeof HydrogenVariantSelector>['options'];
  handle: ComponentProps<typeof HydrogenVariantSelector>['handle'];
  variants: ComponentProps<typeof HydrogenVariantSelector>['variants'];
  defaultOpen?: boolean;
  className?: string;
  popUp?: {
    scheme?: 'light' | 'dark';
    className?: string;
  }
}

const DEFAULT_THEME = 'light';
export const VariantSelector = ({ popUp, className = '', variants, options, handle, defaultOpen = false }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useClickOutside(() => open && setOpen(false));

  const theme = popUp?.scheme || DEFAULT_THEME;

  const linkColor = (active: boolean) => {
    switch (`${active} ${theme}`) {
      case 'true light':
        return "text-neutral-50 bg-neutral-900";
      case 'true dark':
        return "text-neutral-600 bg-neutral-900 border border-neutral-600";
      case 'false light':
        return "text-neutral-600 border border-neutral-600";
      case 'false dark':
        return "text-neutral-900 bg-neutral-50";
    }
  }

  return (
    <HydrogenVariantSelector
      handle={handle}
      options={options}
      variants={variants || []}
    >
      {({ option }) => <>
        <button className={`flex-row-between uppercase text-xs rounded-full px-4 py-2 md:py-2.5 text-neutral-900 
        max-sm:bg-white border border-neutral-300 sm:border-neutral-600 gap-x-4 ${className}`}
          onClick={() => setOpen((o) => !o)}
        >
          {option.value}
          {open ? <Icon.CaretDown className="icon-sm lg:icon-md" /> : <Icon.CaretUp className="icon-sm lg:icon-md" />}
        </button>
        {open && <div ref={ref} className={trim(`p-4 border border-neutral-300 absolute w-full lg:max-w-xl ${popUp?.className} ${theme === "light" ? 'bg-container-light' : 'bg-black'} p-4`)}>
          <p className="mb-4 text-xs uppercase text-neutral-600">Choisissez une variante</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map(({ value, isAvailable, isActive, to }) => {
              return (
                <Link
                  className={trim(`uppercase text-xs rounded-full px-4 py-2 md:py-2.5 ${linkColor(isActive)}`)}
                  key={option.name + value}
                  prefetch="intent"
                  preventScrollReset
                  replace
                  href={to}
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    setOpen(false);
                  }}
                  style={{
                    opacity: isAvailable ? 1 : 0.3,
                  }}
                >
                  {value}
                </Link>
              );
            })}
          </div>
        </div>}
      </>}
    </HydrogenVariantSelector>
  )
}