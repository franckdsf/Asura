import { Icon } from ".";

export const IconFromStr = ({ icon, weight = 'regular' }: { icon?: string, weight?: 'regular' | 'fill' }) => {
  const iconLower = icon?.toLowerCase();

  switch (iconLower) {
    case 'leaf':
      return <Icon.Leaf weight={weight} />
    case 'pencil':
      return <Icon.Pencil weight={weight} />
    case 'tree':
      return <Icon.Tree weight={weight} />
    case 'thumbup':
      return <Icon.ThumbsUp weight={weight} />
    case 'batterychargingvertical':
      return <Icon.BatteryChargingVertical weight={weight} />
    case 'chatcircledots':
      return <Icon.ChatCircleDots weight={weight} />
    case 'circlesthree':
      return <Icon.CirclesThree weight={weight} />
    case 'clock':
      return <Icon.Clock weight={weight} />
    case 'book':
      return <Icon.Book weight={weight} />
    case 'drop':
      return <Icon.Drop weight={weight} />
    case 'eyeclosed':
      return <Icon.EyeClosed weight={weight} />
    case 'eyedropper':
      return <Icon.Eyedropper weight={weight} />
    case 'flowertulip':
      return <Icon.FlowerTulip weight={weight} />
    case 'heart':
      return <Icon.Heart weight={weight} />
    case 'maskhappy':
      return <Icon.MaskHappy weight={weight} />
    case 'palette':
      return <Icon.Palette weight={weight} />
    case 'shieldcheck':
      return <Icon.ShieldCheck weight={weight} />
    case 'smiley':
      return <Icon.Smiley weight={weight} />
    case 'truck':
      return <Icon.Truck weight={weight} />
    case 'sparkle':
      return <Icon.Sparkle weight={weight} />
    default:
      return <Icon.Pencil weight={weight} />
  }
}