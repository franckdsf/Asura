import { useLoaderData, type FetcherWithComponents } from "@remix-run/react";
import {
  AnalyticsEventName, CartForm, getClientBrowserParameters, sendShopifyAnalytics,
  type ShopifyAddToCartPayload, type ShopifyAnalyticsProduct
} from "@shopify/hydrogen";
import { type CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { useEffect } from "react";
import { usePageAnalytics } from "~/pixels/Shopify";
import { trim } from "~/ui/utils/trim";
import { useShopId } from "./useShopId";

function AddToCartAnalytics({
  fetcher,
  children,
}: {
  fetcher: FetcherWithComponents<any>;
  children: React.ReactNode;
}): JSX.Element {
  // Data from action response
  const fetcherData = fetcher.data;
  // Data in form inputs
  const formData = fetcher.formData;
  // Data from loaders
  const pageAnalytics = usePageAnalytics({ hasUserConsent: true });

  const shopId = useShopId();

  useEffect(() => {
    if (formData) {
      const cartData: Record<string, unknown> = {};
      const cartInputs = CartForm.getFormInput(formData);

      try {
        // Get analytics data from form inputs
        if (cartInputs.inputs.analytics) {
          const dataInForm: unknown = JSON.parse(
            String(cartInputs.inputs.analytics),
          );
          Object.assign(cartData, dataInForm);
        }
      } catch {
        // do nothing
      }

      // If we got a response from the add to cart action
      if (Object.keys(cartData).length && fetcherData && shopId) {
        const addToCartPayload: ShopifyAddToCartPayload = {
          ...getClientBrowserParameters(),
          ...pageAnalytics,
          ...cartData,
          cartId: fetcherData.cart.id,
          shopId
        };

        sendShopifyAnalytics({
          eventName: AnalyticsEventName.ADD_TO_CART,
          payload: addToCartPayload,
        });
      }
    }
  }, [fetcherData, formData, shopId, pageAnalytics]);
  return <>{children}</>;
}

export function AddToCartButton({
  product,
  children,
  disabled,
  className = "",
  onClick,
}: {
  className?: string;
  product: Omit<ShopifyAnalyticsProduct, 'variantGid'> & { variantGid: string };
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const analytics = { products: [product] };
  const lines: CartLineInput[] = [{
    merchandiseId: product.variantGid,
    quantity: 1
  }]

  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <AddToCartAnalytics fetcher={fetcher}>
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
        </AddToCartAnalytics>
      )}
    </CartForm>
  );
}