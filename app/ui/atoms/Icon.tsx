import * as PhosphorIcons from '@phosphor-icons/react';
import { CircleNotch } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';
import { trim } from '../utils/trim';

type Props = ComponentProps<typeof CircleNotch>
export const Loader = ({ className = '', ...props }: Props) => <CircleNotch {...props} className={trim(`${className} animate-spin`)} />;

export const Icon = { ...PhosphorIcons, Loader: Loader }

