import { useCallback } from "react"

type EventVariables = Record<string, string> | object;
type Event<T extends EventVariables> = {
  name: string;
  userId?: string;
  transactionId?: string;
  payload?: T;
}
type EventWithoutName<T extends EventVariables> = Omit<Event<T>, 'name'>;
type DataLayer<K extends EventVariables> = Array<Omit<Event<K>, 'name'> & { event: string }>

type AddToCartEvent = {
  cartId: string;
  total: number;
  currency: string;
  products: Array<{
    productId: string,
    variantId?: string,
    price: string,
    currency: string
  }>,
  rawData?: object,
}


export const useGoogleEvents = () => {
  /**
   * internal hook function to send events to Google Tag Manager
   */
  const sendEvent = useCallback((event: Event<EventVariables>) => {
    // if Google Tag Manager isn't available, don't do anything
    if (typeof window === "undefined" || typeof (window as any).dataLayer === "undefined")
      return false;

    const { name, userId, transactionId, payload } = event;

    ((window as any).dataLayer as DataLayer<EventVariables>)
      .push({
        payload,
        userId,
        transactionId,
        event: name,
      })

    return true;
  }, [])

  const sendAddToCartEvent = useCallback(({ payload, transactionId }: EventWithoutName<AddToCartEvent>) => {
    sendEvent({ name: 'add_to_cart', payload, transactionId })
  }, [sendEvent])

  return { sendAddToCartEvent }
}