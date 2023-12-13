import { useCallback } from "react"

type EventVariables = Record<string, string> | object;
type Event<T extends EventVariables> = {
  name: string;
  userId?: string;
  transactionId?: string;
  payload?: T;
}
type EventWithoutName<T extends EventVariables> = Omit<Event<T>, 'name'>;
type EventWithPayloadWithoutName<T extends EventVariables> = Omit<EventWithoutName<T>, 'payload'> & { payload: T };
type DataLayer<K extends EventVariables> = Array<Omit<Event<K>, 'name'> & { event: string }>

type GA4Item = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_brand?: string;
  quantity?: number;
  price?: number;
  discount?: number;
}

type GoogleAdsItem = {
  id: string;
  name: string;
  variant?: string;
  quantity?: number;
  price?: number;
  discount?: number;
  sku?: string;
  brand?: string;
}

type AzameoItem = [string, number | undefined, number];

type ProductItem = {
  productId: string,
  variantId?: string,
  sku?: string;
  brand?: string;
  name: string;
  discount?: number | string;
  quantity?: number;
  price: number | string,
  currency: string;
}

type AddToCartEvent = {
  cartId: string;
  total: number;
  currency: string;
  products: Array<ProductItem>,
  rawData?: object,
}

type BeginCheckoutEvent = {
  cartId: string;
  total: number;
  currency: string;
  products: Array<ProductItem>;
  rawData?: object;
}

const convertProductsToItems = (products: Array<ProductItem>): {
  google_analytics_4: Array<GA4Item>,
  google_ads: Array<GoogleAdsItem>,
  azameo: Array<AzameoItem>,
} => {
  /* Check this documentation for GA4 payload format :
  https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?hl=fr&client_type=gtag#add_or_remove_an_item_from_a_shopping_cart
  */
  const itemsGA4: Array<GA4Item> = products.map((p) => ({
    item_id: p.productId,
    item_name: p.name,
    item_variant: p.variantId,
    item_brand: p.brand,
    price: Number(p.price) || undefined,
    discount: Number(p.discount) || undefined,
    quantity: p.quantity || 1,
  }))

  const itemsAzameo: Array<AzameoItem> = products.map((p) => ([
    p.productId,
    Number(p.price) || undefined,
    p.quantity || 1,
  ]))

  const itemsGoogleAds: Array<GoogleAdsItem> = products.map((p) => ({
    id: p.productId,
    brand: p.brand,
    sku: p.sku,
    name: p.name,
    variant: p.variantId,
    price: Number(p.price) || undefined,
    discount: Number(p.discount) || undefined,
    quantity: p.quantity || 1,
  }))

  return {
    google_analytics_4: itemsGA4,
    google_ads: itemsGoogleAds,
    azameo: itemsAzameo,
  };
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

  const sendBeginCheckout = useCallback(({ userId, transactionId, payload }: EventWithPayloadWithoutName<BeginCheckoutEvent>) => {
    sendEvent({
      name: 'begin_checkout',
      transactionId,
      userId,
      payload: {
        ...payload,
        items: convertProductsToItems(payload.products)
      }
    })
  }, [sendEvent])

  const sendAddToCartEvent = useCallback(({ userId, transactionId, payload }: EventWithPayloadWithoutName<AddToCartEvent>) => {
    sendEvent({
      name: 'add_to_cart',
      transactionId,
      userId,
      payload: {
        ...payload,
        items: convertProductsToItems(payload.products)
      }
    })
  }, [sendEvent])

  return { sendBeginCheckout, sendAddToCartEvent }
}