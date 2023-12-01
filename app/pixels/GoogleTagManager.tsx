import { Script } from "@shopify/hydrogen";
import { useEffect } from "react";

const GOOGLE_TAG_MANAGER_ID = "GTM-PDR3G28M";
const GOOGLE_AW_ID = "AW-11350350384";

/**
 * Google Tag Manager, put it at the top of <body>
 * @returns returns a google tag manager iframe
 */
export const GoogleTagManagerNoScript: React.FC = () => {
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`} title="Google Tag Manager"
        height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
    </noscript>
  );
}


/**
 * Conversion Linker from Google Tag Manager, put it at the top of <head>
 * @returns returns a conversion linker script
 */
const ConversionLinker: React.FC = () => {
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
    })(window, document, 'script', 'dataLayer', GOOGLE_TAG_MANAGER_ID);
  }, []);

  return null;
};


/**
 * Put it at the top of <head>
 * @returns 
 */
export const GoogleTagManager = () => {
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
    gtag('config', GOOGLE_AW_ID);
  }, []);

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_AW_ID}`} />
      <ConversionLinker />
    </>
  )
}