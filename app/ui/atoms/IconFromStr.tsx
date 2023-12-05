import { Icon } from ".";

export const IconFromStr = ({ icon }: { icon?: string }) => {
  const iconLower = icon?.toLowerCase();

  switch (iconLower) {
    case 'leaf':
      return <Icon.Leaf />
    case 'pencil':
      return <Icon.Pencil />
    case 'tree':
      return <Icon.Tree />
    case 'thumbup':
      return <Icon.ThumbsUp />
    case 'batterychargingvertical':
      return <Icon.BatteryChargingVertical />
    case 'chatcircledots':
      return <Icon.ChatCircleDots />
    case 'circlesthree':
      return <Icon.CirclesThree />
    case 'clock':
      return <Icon.Clock />
    case 'book':
      return <Icon.Book />
    case 'drop':
      return <Icon.Drop />
    case 'eyeclosed':
      return <Icon.EyeClosed />
    case 'eyedropper':
      return <Icon.Eyedropper />
    case 'flowertulip':
      return <Icon.FlowerTulip />
    case 'heart':
      return <Icon.Heart />
    case 'maskhappy':
      return <Icon.MaskHappy />
    case 'palette':
      return <Icon.Palette />
    case 'shieldcheck':
      return <Icon.ShieldCheck />
    case 'smiley':
      return <Icon.Smiley />
    case 'sparkle':
      return <Icon.Sparkle />
    default:
      return <Icon.Pencil />
  }
}