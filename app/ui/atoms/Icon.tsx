import { ThumbsUp, Pencil, Tree, Leaf, X, Minus, Plus, ShoppingBag, List, FloppyDisk, CaretDown, CaretUp, SketchLogo, Star, Book, ArrowLeft, ArrowRight, Gavel, Check, CircleNotch } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';
import { trim } from '../utils/trim';

const PhosphorIcons = { ThumbsUp, Tree, Pencil, Leaf, ShoppingBag, X, Minus, Plus, List, FloppyDisk, CaretDown, CaretUp, SketchLogo, Star, Book, ArrowLeft, ArrowRight, Gavel, Check }

type Props = ComponentProps<typeof CircleNotch>
export const Loader = ({ className = '', ...props }: Props) => <CircleNotch {...props} className={trim(`${className} animate-spin`)} />;

export const Icon = { ...PhosphorIcons, Loader }