import { useLocation } from "@remix-run/react";
import { Script } from "@shopify/hydrogen";
import { useEffect, useState } from "react";

export const Tidio = () => {
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!loaded) {
      interval = setInterval(() => {
        if (typeof document !== "undefined" && document.querySelector('#tidio-chat iframe')) {
          setLoaded(true);
        }
      }, 100)
    }
    return () => { if (interval) clearInterval(interval); }
  }, [loaded])


  useEffect(() => {
    const iframe = typeof document !== "undefined" ? document.querySelector('#tidio-chat iframe') as HTMLIFrameElement : undefined;
    if (!loaded || !iframe) return;

    const refresh = () => {
      if (iframe) {
        iframe.style.zIndex = "75";
        if (location.pathname.includes('/products/') && iframe.style.height !== "100%") {
          const width = iframe.clientWidth;
          // if closed
          if (width < 310) {
            iframe.style.bottom = '100px';
          } else {
            iframe.style.bottom = '100px';
          }
        } else {
          iframe.style.bottom = '0px';
        }
      }
    }

    // track the iframe #tidio-chat and check if it's width is > 300 or not
    // if it's not then put it's inset at 100px from the bottom
    // else put it at 100px
    const observer = new MutationObserver(() => refresh());
    refresh();

    observer.observe(iframe as Element, { attributes: true, childList: true, subtree: true });

    return () => observer.disconnect();

  }, [location, loaded])

  return <Script src="//code.tidio.co/xxvzjerbarhyhfri1elyrnd9ymf40vf1.js" async />
}