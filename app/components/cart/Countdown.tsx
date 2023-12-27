import { useEffect, useState } from "react"

function minTwoDigits(n: number) {
  return (n < 10 ? '0' : '') + n;
}

const newDate = () => {
  const now = new Date();
  const generateNewDate = () => new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 15);

  let date = localStorage.getItem('cart-countdown') || generateNewDate();
  if (new Date(date) < now) date = generateNewDate();

  localStorage.setItem('cart-countdown', date.toString());

  return new Date(date);
}


const useCountdown = () => {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    // create a countdown for every second, until next countdown
    const interval = setInterval(() => {
      setDate(newDate());
    }, 1000)

    return () => clearInterval(interval);
  }, [])

  const formatTime = (timeInSeconds: number) => {
    // format time
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    let str = hours > 0 ? `${minTwoDigits(hours)}:` : '';
    str += minutes > 0 ? `${minTwoDigits(minutes)}:` : '';
    str += `${minTwoDigits(seconds)}`;

    return str;
  };

  return date ? formatTime((date.getTime() - new Date().getTime()) / 1000) : null;
}

export const Countdown = () => {
  const date = useCountdown();

  return (
    <div className="px-4 py-3 bg-neutral-300 text-neutral-900 rounded-xs">
      <p className="w-full text-sm text-center">
        Il vous reste seulement
        <span className="mx-1 font-medium text-neutral-900">
          {date}
        </span>
        pour obtenir votre commande avec <span className="font-medium">une livraison GRATUITE</span> !
      </p>
    </div>
  )
}