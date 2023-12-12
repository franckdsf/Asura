import { useLocation, useMatches } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import {
  useShopifyCookies, AnalyticsEventName,
  type ShopifyPageViewPayload, getClientBrowserParameters, sendShopifyAnalytics
} from '@shopify/hydrogen';

export function usePageAnalytics({ hasUserConsent } = { hasUserConsent: true }) {
  const matches = useMatches();
  const analyticsFromMatches = useMemo(() => {
    const data: Record<string, unknown> = {};

    matches.forEach((event) => {
      const eventData = event?.data;
      if (eventData) {
        // @ts-ignore
        eventData['analytics'] && Object.assign(data, eventData['analytics']);

        // @ts-ignore
        const selectedLocale = eventData['selectedLocale'] || { currency: 'EUR', language: 'fr' };
        Object.assign(data, {
          currency: selectedLocale.currency,
          acceptedLanguage: selectedLocale.language,
        });
      }
    });

    return {
      ...data,
      hasUserConsent
    } as unknown as ShopifyPageViewPayload;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  return analyticsFromMatches;
}

export const useShopifyPixel = ({ shopId }: { shopId: string }) => {
  const location = useLocation();
  const lastLocationKey = useRef<string>('');

  const pageAnalytics = usePageAnalytics();

  useShopifyCookies({ hasUserConsent: true });

  useEffect(() => {
    // Filter out useEffect running twice
    if (lastLocationKey.current === location.key) return;

    lastLocationKey.current = location.key;

    const payload = {
      ...getClientBrowserParameters(),
      ...pageAnalytics,
      shopId
    };

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload,
    });

    // This hook is where you can send a page view event to Shopify and other third-party analytics
  }, [location, shopId, pageAnalytics]);
}


// ORDER - TRACKING SAVE

/* 
<script>
window.dataLayer = window.dataLayer || [];

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PDR3G28M');

dataLayer.push({
  event: "purchase",
  transaction_id: "{{ order.order_number }}",
  payload: {
      transaction_id: "{{ order.order_number }}",
      total: {{ total_price | times: 0.01 }},
      tax: {{ tax_price | times: 0.01 }},
      shipping: {{ shipping_price | times: 0.01 }},
      currency: "{{ order.currency }}",
      rawData: undefined,
      items: [
       {% for line_item in line_items %}{
        item_variant: "{{ line_item.variant_id }}",
        item_id: "{{ line_item.product_id }}",
        item_name: "{{ line_item.product.title }}",
        currency: "{{ order.currency }}",
        price: {{ line_item.final_price | times: 0.01 }},
        quantity: {{ line_item.quantity }}
      },{% endfor %}
 ]
  }
});
</script>

*/