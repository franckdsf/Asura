import { useEffect, useMemo, useState } from "react"

type Props = { className?: string }
export const DeliveryDate = ({ className = "" }: Props) => {
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

  return (
    <p className={`text-xs lg:text-sm uppercase text-neutral-600 ${className}`}>
      en stock, livré entre le {fourDaysAfter} - {tenDaysAfter}
    </p>
  )
}