import { type FetcherWithComponents } from "@remix-run/react";
import { CartForm } from "@shopify/hydrogen";
import { type CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { trim } from "~/ui/utils/trim";

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  className = "",
  onClick,
}: {
  className?: string;
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={trim(`text-xs md:text-md px-6 md:px-8 py-3 rounded-full bg-neutral-900 text-neutral-50 uppercase ${className}`)}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}