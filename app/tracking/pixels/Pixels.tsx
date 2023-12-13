import { GoogleTagManagerNoScript, GoogleTagManager } from "./GoogleTagManager";
import { Hotjar } from "./Hotjar";

const GOOGLE_TAG_MANAGER_ID = "GTM-PDR3G28M";
const HOTJAR = { hjid: 3766033, hjsv: 6 }

type Props = { environment?: 'development' | 'production' }
/**
 * Use it in the <head>
 */
export const HeadPixel = ({ environment }: Props) => environment === "production" ? (
  <>
    {/* <GoogleAdsTag /> */}
    <GoogleTagManager id={GOOGLE_TAG_MANAGER_ID} />
    <Hotjar {...HOTJAR} />
  </>
) : null;

/**
 * Use it at the top of the <body>
 */
export const BodyPixel = ({ environment }: Props) => environment === "production" ? (
  <>
    <GoogleTagManagerNoScript id={GOOGLE_TAG_MANAGER_ID} />
  </>
) : null;