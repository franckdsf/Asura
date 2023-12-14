
type EventVariables = Record<string, string> | object;
export type Event<T extends EventVariables> = {
  name: string;
  userId?: string;
  transactionId?: string;
  payload?: T;
}
export type EventWithoutName<T extends EventVariables> = Omit<Event<T>, 'name'>;
export type EventWithPayloadWithoutName<T extends EventVariables> = Omit<EventWithoutName<T>, 'payload'> & { payload: T };
export type DataLayer<K extends EventVariables> = Array<Omit<Event<K>, 'name'> & { event: string }>

export type GA4Item = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_brand?: string;
  quantity?: number;
  price?: number;
  discount?: number;
}

export type GoogleAdsItem = {
  id: string;
  name: string;
  variant?: string;
  quantity?: number;
  price?: number;
  discount?: number;
  sku?: string;
  brand?: string;
}

export type AzameoItem = [string, number | undefined, number];

export type ProductItem = {
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

export type AddToCartEvent = {
  cartId: string;
  total: number;
  currency: string;
  products: Array<ProductItem>,
  rawData?: object,
}

export type BeginCheckoutEvent = {
  cartId: string;
  total: number;
  currency: string;
  products: Array<ProductItem>;
  rawData?: object;
}

export type ViewItemEvent = {
  product: ProductItem;
}