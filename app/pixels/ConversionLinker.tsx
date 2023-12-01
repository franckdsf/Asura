import { useEffect } from "react";

/**
 * Conversion Linker from Google Tag Manager
 * @returns returns a conversion linker script
 */
export const ConversionLinker: React.FC = () => {
  useEffect(() => {
    (function (w: Window, d: Document, s: string, l: string, i: string) {
      // @ts-ignore
      w[l] = w[l] || [];
      // @ts-ignore
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      // eslint-disable-next-line no-var
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== 'dataLayer' ? '&l=' + l : '';
      (j as any).async = true;
      (j as any).src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      if (f && f.parentNode) {
        f.parentNode.insertBefore(j, f);
      }
    })(window, document, 'script', 'dataLayer', 'GTM-PDR3G28M');
  }, []);

  return null;
};
