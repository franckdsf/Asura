import { JudgemeReviewWidget, useJudgeme, JudgemePreviewBadge } from '@judgeme/shopify-hydrogen'
import { trim } from "~/ui/utils/trim"
import { type RefObject, useEffect, useRef, useState } from "react"
import { Icon } from '~/ui/atoms'

export const JudgeMeReviews = ({ productId, className }: { className?: string, productId: string }) => {
  useJudgeme({
    shopDomain: 'f22921-2.myshopify.com',
    publicToken: 'HfCllSLXKeBh1Lf2noMU10gI7j4',
    cdnHost: 'https://cdn.judge.me',
    delay: 500
  })

  return (
    <div className={trim(`mx-auto ${className}`)}>
      <JudgemeReviewWidget id={productId} />
    </div>
  )
}

const TIMER = 500;
const FakeStarsComponent = ({ parent }: { parent: RefObject<HTMLDivElement> }) => {
  const [showFakeReviews, setShowFakeReviews] = useState<boolean | null>(false);
  useEffect(() => {
    const t = setTimeout(() => {
      // get the value of the attribute data-number-of-reviews
      const numberOfReviews = parent.current?.querySelector('[data-number-of-reviews]')?.getAttribute('data-number-of-reviews');
      if ((Number(numberOfReviews) || 0) === 0) setShowFakeReviews(true);
    }, TIMER + 500)

    return () => clearTimeout(t)
  }, [parent])

  if (!showFakeReviews) return null;
  return (
    <div className="flex text-[#FBC400] icon-xs gap-x-0.5">
      {/* eslint-disable-next-line react/no-array-index-key */}
      {Array(4).fill(0).map((_, i) => <Icon.Star weight="fill" key={i} />)}
      <Icon.StarHalf weight="fill" />
    </div>
  )
}

export const JudgeMeReviewStars = ({ productId, className }: { className?: string, productId: string }) => {
  const div = useRef<HTMLDivElement>(null);

  useJudgeme({
    shopDomain: 'f22921-2.myshopify.com',
    publicToken: 'HfCllSLXKeBh1Lf2noMU10gI7j4',
    cdnHost: 'https://cdn.judge.me',
    delay: TIMER
  })



  return (
    <div className={trim(`h-4 ${className}`)} ref={div}>
      <style>
        {`
          .jdgm-preview-badge[data-template="product"] {
            display: block !important;
            font-size: 11px;
          }
        `}
      </style>
      <FakeStarsComponent parent={div} />
      <JudgemePreviewBadge id={productId} template="product" />
    </div>
  )

}