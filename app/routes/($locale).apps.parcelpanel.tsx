import { Script } from "@shopify/hydrogen";
import { useEffect } from "react";
import { Icon } from "@ui/atoms";

export default function Parcel() {
  useEffect(() => {
    const tracking = "#pp-tracking-page-app";
    const element = document.querySelector(tracking);

    const checker = setTimeout(() => {
      if (element?.hasAttribute('data-v-app')) return;

      location.reload();
    }, 2000)



    return () => clearTimeout(checker);

  }, [])

  return (
    <div>
      <div id="pp-tracking-page-app">
        <div className="flex-row-center py-56">
          <Icon.Loader className="animate-spin icon-lg" />
        </div>
      </div>
      <Script src="//pp-proxy.parcelpanel.com/assets/tracking/track-page.js" />
      <div id="pp-tracking-shop" style={{ display: "none" }}>f22921-2.myshopify.com</div>
    </div>
  )
}