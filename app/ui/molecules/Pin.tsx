import { Icon, IconFromStr } from "../atoms"

type Props = {
  title: string;
  icon?: string;
  details?: string;
}
export const Pin = ({ icon, title, details }: Props) => {
  return (
    <div className="relative inline-flex px-4 py-2 mt-6 text-black uppercase rounded-full bg-neutral-300 align-center gap-x-2 group">
      {icon && <IconFromStr icon={icon} />}
      <span className="text-xs">{title}</span>
      {details && <Icon.Info className="cursor-pointer" />}
      {details && <div className="group-hover:block hidden rounded-xs absolute left-0 w-[120%] max-w-xs px-4 pb-2 pt-3 text-sm normal-case bg-neutral-900 bottom-12">
        <p className="flex flex-row items-center justify-start mb-1.5 text-xs font-semibold text-white uppercase">
          <Icon.Info className="mr-1 icon-sm" />
          détails
        </p>
        <p className="text-white">
          {details}
        </p>
      </div>}
    </div>
  )
}