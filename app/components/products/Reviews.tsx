import { Script } from "@shopify/hydrogen"
import { JudgemeReviewWidget, useJudgeme } from '@judgeme/shopify-hydrogen'

export const JudgeMeReviews = ({ productId }: { productId: string }) => {
  useJudgeme({
    shopDomain: 'f22921-2.myshopify.com',
    publicToken: 'HfCllSLXKeBh1Lf2noMU10gI7j4',
    cdnHost: 'https://cdn.judge.me',
    delay: 500
  })

  return (
    <div>
      <JudgemeReviewWidget id={productId} />
    </div>
  )
}