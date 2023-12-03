import { Script } from "@shopify/hydrogen";
import { useEffect } from "react";

/**
 * Google Tag Manager for noscript (optional), put it at the top of <body>
 * @returns returns a google tag manager iframe
 */
export const GoogleTagManagerNoScript = ({ id }: { id: string }) => {
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${id}`} title="Google Tag Manager"
        height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
    </noscript>
  );
}


/**
 * Google Tag Manager, put it at the top of <head>
 * @returns returns a Tag Manager
 */
export const GoogleTagManager = ({ id }: { id: string }) => {
  useEffect(() => {
    (function (w: Window, d: Document, s: string, l: string, i: string) {
      const src = 'https://www.googletagmanager.com/gtm.js?id=';
      if (d.querySelector(`script[src^="${src}${i}"]`)) return;
      // @ts-ignore
      w[l] = w[l] || [];
      // @ts-ignore
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      // eslint-disable-next-line no-var
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== 'dataLayer' ? '&l=' + l : '';
      (j as any).async = true;
      (j as any).src = src + i + dl;
      if (f && f.parentNode) {
        f.parentNode.insertBefore(j, f);
      }
    })(window, document, 'script', 'dataLayer', id);
  }, [id]);

  return null;
};

/**
 * Put it at the top of <head>
 * @returns 
 */
export const GoogleAdsTag = ({ id }: { id: string }) => {
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag() {
      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    }
    // @ts-ignore
    gtag('js', new Date());
    // @ts-ignore
    gtag('config', id);
  }, []);

  return (
    <Script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
  )
}
