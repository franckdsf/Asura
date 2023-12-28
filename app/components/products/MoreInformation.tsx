import { trim } from "~/ui/utils/trim";
import { Accordion } from "~/ui/molecules";
import { type ComponentProps } from "react";

type Props = {
  className?: string;
  included?: ComponentProps<typeof Accordion>['content'];
  delivery?: ComponentProps<typeof Accordion>['content'];
  guaranty?: ComponentProps<typeof Accordion>['content'];
}

type MoreInformationProps = Props & {
  showTitleOnMobile?: boolean;
}

export const MoreInformation = ({ included, delivery, guaranty, showTitleOnMobile = true, className = "" }: MoreInformationProps) => (
  <div className={trim(`px-4 md:px-10 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-x-48 xl:gap-x-72 ${className}`)}>
    <h3 className={trim(`${!showTitleOnMobile && 'max-md:hidden'} pt-8 lg:max-w-xs uppercase max-md:scale-75 text-2xl lg:text-4xl font-accent text-neutral-600`)}>
      plus d’informations
    </h3>
    <ul className="w-full max-w-xl mt-8 xl:flex-shrink-0 lg:-mt-2">
      {included && <li>
        <Accordion
          icon="sparkle"
          // title="inclus"
          title="caractéristiques"
          content={included}
        />
      </li>}
      {delivery && <li>
        <Accordion
          icon={'truck'}
          title="livraison"
          content={delivery}
        />
      </li>}
      {guaranty && <li>
        <Accordion
          icon="shieldCheck"
          title="garantie"
          content={guaranty}
        />
      </li>}
    </ul>
  </div>
)

MoreInformation.Small = ({ included, delivery, guaranty, className = "" }: Props) => {
  return (
    <ul className={trim(`w-full ${className}`)}>
      {included && <li>
        <Accordion.Small
          icon="sparkle"
          // title="inclus"
          title="caractéristiques"
          content={included}
        />
      </li>}
      {delivery && <li>
        <Accordion.Small
          icon={'truck'}
          title="livraison"
          content={delivery}
        />
      </li>}
      {guaranty && <li>
        <Accordion.Small
          icon="shieldCheck"
          title="garantie"
          content={guaranty}
        />
      </li>}
    </ul>
  )
}