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