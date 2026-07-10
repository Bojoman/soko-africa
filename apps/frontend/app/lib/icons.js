import {
  Wheat,
  Shirt,
  Hammer,
  Sparkles,
  Beef,
  CreditCard,
  Wallet,
  Smartphone,
  Landmark,
  Bitcoin,
  Palette,
  Coffee,
  Gem,
  Music,
  Flame,
  Scissors,
  HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  Wheat,
  Shirt,
  Hammer,
  Sparkles,
  Beef,
  CreditCard,
  Wallet,
  Smartphone,
  Landmark,
  Bitcoin,
  Palette,
  Coffee,
  Gem,
  Music,
  Flame,
  Scissors
};

export function getIcon(name) {
  return ICON_MAP[name] || HelpCircle;
}

export default ICON_MAP;
