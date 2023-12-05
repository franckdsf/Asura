import { Script, parseGid } from "@shopify/hydrogen"
import { useEffect } from "react"

export const Reviews = ({ productId, storeDomain }: { productId: string, storeDomain: string }) => {
  useEffect(() => {
    const t = setInterval(() => {
      const iframe = document.querySelector('#looxReviewsFrame') as HTMLIFrameElement;
      if (iframe)
        iframe.style.minHeight = '100vh';
    }, 1000)
    return () => clearInterval(t);
  }, [])

  return (
    <div className="py-32 my-8 border border-neutral-500">
      <Script async src={`https://loox.io/widget/loox.js?shop=${storeDomain}`} />
      <p>Loox integration ⬇️</p>
      <div id="looxReviews" data-product-id={parseGid(productId)} />
    </div>
  )
}