import { NavLink } from "@remix-run/react";
import { ComponentProps } from "react";
import { trim } from "../utils/trim";

type Props = Omit<ComponentProps<typeof NavLink>, 'to'> & {
  href: string;
  underline?: boolean;
  uppercase?: boolean;
};
export const Link = ({ href, className, underline = false, uppercase = false, ...props }: Props) => <NavLink {...props} to={href}
  className={trim(`${className} ${uppercase && 'uppercase'} ${underline && 'underline underline-offset-8'}`)}
/>