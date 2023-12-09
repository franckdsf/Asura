import { useCallback, type ReactNode } from "react"
import { useGoogleEvents } from "../hooks";
import { type CartApiQueryFragment } from "storefrontapi.generated";
import { usePageAnalytics } from "../pixels/Shopify";
import { getClientBrowserParameters, parseGid } from "@shopify/hydrogen";
type Props = {
  children: ReactNode;
  className?: string;
  cart: CartApiQueryFragment;
}

export const CheckoutLink = ({ className = '', cart, children }: Props) => {
  const { sendBeginCheckout } = useGoogleEvents();

  const pageAnalytics = usePageAnalytics({ hasUserConsent: true });

  const sendEvent = useCallback(() => {
    const clientData = { ...getClientBrowserParameters(), ...pageAnalytics }

    sendBeginCheckout({
      userId: clientData.uniqueToken,
      transactionId: parseGid(cart.id).id,
      payload: {
        cartId: parseGid(cart.id).id,
        total: Number(cart.cost.totalAmount.amount),
        currency: cart.cost.totalAmount.currencyCode,
        products: cart.lines.nodes.map((p) => ({
          productId: parseGid(p.merchandise.product.id).id,
          variantId: parseGid(p.merchandise.id).id,
          name: p.merchandise.product.title,
          discount: 0,
          quantity: p.quantity,
          price: Number(p.merchandise.price.amount),
          currency: p.cost.totalAmount.currencyCode,
        }))
      }
    })
  }, [sendBeginCheckout, cart, pageAnalytics]);

  return (
    <a
      href={cart.checkoutUrl}
      target="_self"
      className={`${className}`}
      onClick={sendEvent}
    >
      {children}
    </a>
  )
}