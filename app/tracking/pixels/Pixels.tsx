import { GoogleTagManagerNoScript, GoogleTagManager } from "./GoogleTagManager";
import { Hotjar } from "./Hotjar";

const GOOGLE_TAG_MANAGER_ID = "GTM-PDR3G28M";
const HOTJAR = { hjid: 3766033, hjsv: 6 }

/**
 * Use it in the <head>
 */
export const HeadPixel = () => (
  <>
    {/* <GoogleAdsTag /> */}
    <GoogleTagManager id={GOOGLE_TAG_MANAGER_ID} />
    <Hotjar {...HOTJAR} />
  </>
)

/**
 * Use it at the top of the <body>
 */
export const BodyPixel = () => (
  <>
    <GoogleTagManagerNoScript id={GOOGLE_TAG_MANAGER_ID} />
  </>
)