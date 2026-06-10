import { Colors } from '@/constants/Colors';
import { colorAtom } from '@/store/atoms';
import { useAtomValue } from 'jotai';

export const useThemeStyles = () => {
  const color = useAtomValue(colorAtom);
  return {
    color1: color ? Colors.dark.text : Colors.light.text,
    color2: !color ? Colors.dark.text : Colors.light.text,
  };
};
