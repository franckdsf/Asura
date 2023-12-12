import {
  BatteryChargingVertical, ChatCircleDots, CirclesThree, Clock, Drop, EyeClosed, Eyedropper, FlowerTulip, Heart, MaskHappy, Palette, ShieldCheck, Smiley, Sparkle,
  ThumbsUp, Pencil, Tree, Leaf, X, Minus, Plus, ShoppingBag, List, FloppyDisk, CaretDown, CaretUp, SketchLogo,
  Star, Book, ArrowLeft, ArrowRight, Gavel, Check, CircleNotch, StarHalf, Truck, Info,
} from '@phosphor-icons/react';
import type { ComponentProps } from 'react';
import { trim } from '../utils/trim';

const PhosphorIcons = {
  BatteryChargingVertical, ChatCircleDots, CirclesThree, Clock, Drop, EyeClosed, Eyedropper, FlowerTulip, Heart, MaskHappy, Palette, ShieldCheck, Smiley, Sparkle,
  ThumbsUp, Tree, Pencil, Leaf, ShoppingBag, X, Minus, Plus, List, FloppyDisk, CaretDown, CaretUp, SketchLogo, Star, Book, ArrowLeft, ArrowRight, Gavel, Check,
  StarHalf, Truck, Info
}

type Props = ComponentProps<typeof CircleNotch>
export const Loader = ({ className = '', ...props }: Props) => <CircleNotch {...props} className={trim(`${className} animate-spin`)} />;

export const Icon = { ...PhosphorIcons, Loader }