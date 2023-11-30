import { Script } from "@shopify/hydrogen"

export const Reviews = ({ productId, storeDomain }: { productId: string, storeDomain: string }) => {
  return (
    <div>
      <Script async src={`https://loox.io/widget/loox.js?shop=${storeDomain}`} />
      <div id="looxReviews" data-product-id={productId} />
    </div>
  )
}