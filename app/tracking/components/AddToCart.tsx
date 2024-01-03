import { type FetcherWithComponents } from "@remix-run/react";
import {
  AnalyticsEventName, CartForm, getClientBrowserParameters, sendShopifyAnalytics,
  type ShopifyAddToCartPayload, type ShopifyAnalyticsProduct
} from "@shopify/hydrogen";
import { type CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { useEffect } from "react";
import { usePageAnalytics } from "../pixels/Shopify";
import { trim } from "~/ui/utils/trim";
import { useGoogleEvents, useShopId } from "../hooks";
import { parseGid } from '@shopify/hydrogen';

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

  const { sendAddToCartEvent } = useGoogleEvents();
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

        sendAddToCartEvent({
          userId: addToCartPayload.uniqueToken,
          payload: {
            cartId: parseGid(fetcherData.cart.id).id,
            currency: addToCartPayload.currency,
            total: addToCartPayload.products?.reduce((a, n) => a + Number(n.price), 0) || 0,
            products: addToCartPayload.products?.map((p) => ({
              sku: p.sku || undefined,
              name: p.name,
              brand: p.brand,
              productId: parseGid(p.productGid).id,
              variantId: parseGid(p.variantGid).id,
              price: p.price,
              quantity: p.quantity,
              discount: undefined,
              currency: addToCartPayload.currency
            })) || []
            ,
            rawData: addToCartPayload,
          },
        })

        sendShopifyAnalytics({
          eventName: AnalyticsEventName.ADD_TO_CART,
          payload: addToCartPayload,
        });
      }
    }
  }, [sendAddToCartEvent, fetcherData, formData, shopId, pageAnalytics]);
  return <>{children}</>;
}

export function AddToCartButton({
  product,
  children,
  disabled,
  className = "",
  openCart = false,
  showPaymentMethods = false,
  quantity = 1,
  onClick,
}: {
  quantity?: number;
  className?: string;
  product: Omit<ShopifyAnalyticsProduct, 'variantGid'> & { variantGid: string; };
  children: React.ReactNode;
  disabled?: boolean;
  openCart?: boolean;
  showPaymentMethods?: boolean;
  onClick?: () => void;
}) {
  const analytics = { products: [product] };
  const lines: CartLineInput[] = [{
    merchandiseId: product.variantGid,
    quantity: quantity ?? 1,
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
            onClick={() => { if (onClick) onClick(); if (openCart) window.location.href = window.location.href + '#cart-aside'; }}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={trim(`text-xs md:text-md px-6 md:px-8 py-3 rounded-full bg-neutral-900 text-neutral-50 uppercase ${className}`)}
          >
            {children}
          </button>
          {showPaymentMethods && <img src="/assets/payment-methods.webp" width={500} height={37} alt="payment methods" className="object-contain h-6 mt-4" />}
        </AddToCartAnalytics>
      )}
    </CartForm>
  );
}