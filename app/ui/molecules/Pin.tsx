import { Icon, IconFromStr } from "../atoms"

type Props = {
  title: string;
  icon?: string;
  details?: string;
}
export const Pin = ({ icon, title, details }: Props) => {
  return (
    <div className="inline-flex px-4 py-2 mt-6 text-black uppercase rounded-full bg-neutral-300 align-center gap-x-2">
      {icon && <IconFromStr icon={icon} />}
      <span className="text-xs">{title}</span>
    </div>
  )
}