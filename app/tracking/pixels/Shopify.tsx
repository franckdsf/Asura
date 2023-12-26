import { useLocation, useMatches } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import {
  useShopifyCookies, AnalyticsEventName,
  type ShopifyPageViewPayload, getClientBrowserParameters, sendShopifyAnalytics, ShopifySalesChannel
} from '@shopify/hydrogen';
import { STORE } from "~/store.info";

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

const hasUserConsent = true;
const domain = STORE.domain;

export const useShopifyPixel = ({ shopId }: { shopId: string }) => {
  const location = useLocation();
  const lastLocationKey = useRef<string>('');

  const pageAnalytics = usePageAnalytics({ hasUserConsent });

  useShopifyCookies({ hasUserConsent, domain });

  useEffect(() => {
    // Filter out useEffect running twice
    if (lastLocationKey.current === location.key) return;

    lastLocationKey.current = location.key;

    const payload = {
      ...getClientBrowserParameters(),
      ...pageAnalytics,
      shopId,
      shopifySalesChannel: ShopifySalesChannel.hydrogen
    };

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload
    });

    // This hook is where you can send a page view event to Shopify and other third-party analytics
  }, [location, shopId, pageAnalytics]);
}


// ORDER - TRACKING SAVE
// Check notion https://www.notion.so/desfcorp/Documentation-8af13bca87854ee78009874ed0b26dcd?pvs=4#9d2ce0272b2a49278734136c038e2cf8