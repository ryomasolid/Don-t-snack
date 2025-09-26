import { Colors } from '@/constants/Colors';
import { colorAtom } from '@/store/atoms';
import { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

export type ContainerComponentProps = ViewProps & {
  children: ReactNode
};

export function ContainerComponent({ children }: ContainerComponentProps) {
  const { useAtomValue } = require("jotai");
  const color = useAtomValue(colorAtom)
  const bgColor = !color ? Colors.dark.text : Colors.light.text

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: "100%",
    padding: 10
  }
});