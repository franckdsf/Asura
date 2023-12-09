import { trim } from "~/ui/utils/trim";
import { Accordion } from "~/ui/molecules";
import { type ComponentProps } from "react";

type Props = {
  className?: string;
  showTitleOnMobile?: boolean;
  included?: ComponentProps<typeof Accordion>['content'];
  delivery?: ComponentProps<typeof Accordion>['content'];
  guaranty?: ComponentProps<typeof Accordion>['content'];
}

export const MoreInformation = ({ included, delivery, guaranty, showTitleOnMobile = true, className = "" }: Props) => (
  <div className={trim(`px-4 md:px-10 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-x-48 xl:gap-x-72 ${className}`)}>
    <h3 className={trim(`${!showTitleOnMobile && 'max-md:hidden'} pt-8 lg:max-w-xs uppercase max-md:scale-75 text-2xl lg:text-4xl font-accent text-neutral-600`)}>
      plus d’informations
    </h3>
    <ul className="w-full max-w-xl mt-8 xl:flex-shrink-0 lg:-mt-2">
      {included && <li>
        <Accordion
          title="inclus"
          content={included}
        />
      </li>}
      {delivery && <li>
        <Accordion
          title="livraison"
          content={delivery}
        />
      </li>}
      {guaranty && <li>
        <Accordion
          title="garantie"
          content={guaranty}
        />
      </li>}
    </ul>
  </div>
)