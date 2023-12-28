import { useEffect, useMemo, useState } from "react"
import { Icon } from "~/ui/atoms";

type Props = { className?: string, type?: 'date' | 'expedition' }
export const DeliveryDate = ({ className = "", type = 'date' }: Props) => {
  const [currentDate] = useState(new Date());

  const fourDaysAfter = useMemo(() => {
    // Calculate date 4 days after
    const date = new Date(currentDate);

    date.setDate(currentDate.getDate() + 4);

    const options = { day: 'numeric', month: 'short' } as const;
    const str = date.toLocaleDateString('fr-FR', options);
    return str;
  }, [currentDate]);

  const tenDaysAfter = useMemo(() => {
    // Calculate date 4 days after
    const date = new Date(currentDate);

    date.setDate(currentDate.getDate() + 10);

    const options = { day: 'numeric', month: 'short' } as const;
    const str = date.toLocaleDateString('fr-FR', options);
    return str;
  }, [currentDate]);

  const text = useMemo(() => type === 'date' ? `Livré entre le ${fourDaysAfter} - ${tenDaysAfter}` : 'Expédié en 24 / 48h',
    [fourDaysAfter, tenDaysAfter, type]);

  return (
    <div className={`flex flex-row items-center justify-around bg-success-100 text-success-500 py-3 px-3 md:px-4 rounded-xs ${className}`}>
      <p className={`text-xs lg:text-sm first-letter:uppercase mr-2 2xl:mr-6`}>
        <Icon.Check className="inline-block mr-2 -mt-0.5" />
        Livraison gratuite
      </p>
      <p className={`text-xs lg:text-sm first-letter:uppercase ml-2`}>
        <img src="/assets/french_flag.png" width={20} height={12} alt="drapeau français"
          className="inline-block rounded-none mr-2 -mt-0.5"
        />
        {text}
      </p>
    </div>
  )
}