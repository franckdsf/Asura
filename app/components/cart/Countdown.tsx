import { useEffect, useState } from "react"

export const Countdown = () => {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    // create a countdown for every second, until next day
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      setDate(tomorrow);
    }, 1000)

    return () => clearInterval(interval);
  }, [])

  const formatTime = (timeInSeconds: number) => {
    // format time
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    let str = hours > 0 ? `${hours}h : ` : '';
    str += minutes > 0 ? `${minutes}m : ` : '';
    str += `${seconds}s`;

    return str;
  };

  return (
    <div className="px-4 py-3 bg-neutral-300 text-neutral-900 rounded-xs">
      <p className="w-full text-sm text-center">
        notre promotion se termine dans
        <span className="block mt-1 font-medium text-neutral-900 text-md">
          {date && formatTime((date.getTime() - new Date().getTime()) / 1000)}
        </span>
      </p>
    </div>
  )
}