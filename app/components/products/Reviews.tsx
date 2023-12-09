import { JudgemeReviewWidget, useJudgeme, JudgemePreviewBadge } from '@judgeme/shopify-hydrogen'
import { trim } from "~/ui/utils/trim"
import { type RefObject, useEffect, useRef, useState } from "react"
import { Icon } from '~/ui/atoms'
import { DelayHeight } from '~/ui/wrappers'
import { parseGid } from '@shopify/hydrogen'

/** Use this at the top of the page to activate the judgeMe widgets */
export const useJudgeMe = () => {
  useJudgeme({
    shopDomain: 'f22921-2.myshopify.com',
    publicToken: 'HfCllSLXKeBh1Lf2noMU10gI7j4',
    cdnHost: 'https://cdn.judge.me',
    delay: 500
  });
}

export const JudgeMeReviews = ({ productId, className }: { className?: string, productId: string }) => {
  return (
    <div className={trim(`mx-auto ${className}`)}>
      <DelayHeight>
        {(ref) => <div ref={ref}>
          <JudgemeReviewWidget id={productId} />
        </div>}
      </DelayHeight>
    </div>
  )
}

const TIMER = 500;
const FakeStarsComponent = ({ parent, id }: { id?: string, parent?: RefObject<HTMLDivElement> }) => {
  const [reviewsCount, setReviewsCount] = useState<number>(0);

  useEffect(() => {
    const lookForParentReviews = () => {
      // get the value of the attribute data-number-of-reviews
      const numberOfReviews = parent?.current?.querySelector('[data-number-of-reviews]')?.getAttribute('data-number-of-reviews');
      if ((Number(numberOfReviews) || 0) === 0) { setReviewsCount(0) }
      else { setReviewsCount(Number(numberOfReviews)) }
    }

    const t1 = setTimeout(lookForParentReviews, TIMER + 300)
    const t2 = setTimeout(lookForParentReviews, TIMER + 700)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [parent])

  return (
    <button className="flex text-[#FBC400] icon-xs gap-x-0.5 flex-row justify-start items-center"
      aria-label='scroll to reviews'
      onClick={() => {
        if (!id) return;
        // scroll to the first .jdgm-review-widget element
        const reviewWidget = document?.querySelector(`.jdgm-review-widget[data-id="${parseGid(id).id}"]`);
        reviewWidget?.scrollIntoView({ behavior: 'smooth' });
      }}>
      {/* eslint-disable-next-line react/no-array-index-key */}
      {Array(4).fill(0).map((_, i) => <Icon.Star weight="fill" key={i} />)}
      <Icon.StarHalf weight="fill" />
      {reviewsCount > 0 && <span className="ml-1 text-xs text-black">{reviewsCount} avis</span>}
    </button>
  )
}

export const JudgeMeReviewStars = ({ productId, className }: { className?: string, productId: string }) => {
  const div = useRef<HTMLDivElement>(null);

  return (
    <div className={trim(`h-4 ${className}`)} ref={div}>
      <style>
        {`
          .jdgm-preview-badge[data-template="product"] {
            display: hidden !important;
            font-size: 11px;
          }
        `}
      </style>
      <FakeStarsComponent parent={div} id={productId} />
      <JudgemePreviewBadge id={productId} template="product" />
    </div>
  )
}
