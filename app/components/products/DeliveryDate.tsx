import { useEffect, useMemo, useState } from "react"

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

  const text = useMemo(() => type === 'date' ? ` en stock, livré entre le ${fourDaysAfter} - ${tenDaysAfter}` : 'en stock, expédié en 24 / 48h',
    [fourDaysAfter, tenDaysAfter, type]);

  return (
    <div className={`flex flex-row items-center justify-start ${className}`}>
      <img src="/assets/french_flag.png" width={20} height={12} alt="drapeau français" className="rounded-none" />
      <p className={`text-xs lg:text-sm uppercase text-neutral-600 ml-2`}>
        {text}
      </p>
    </div>
  )
}