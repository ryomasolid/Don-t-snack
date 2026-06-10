import { useThemeStyles } from '@/hooks/useThemeStyles';
import { colorAtom } from '@/store/atoms';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { Pressable, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

export function CustomHeader() {
  const theme = useThemeStyles();
  const [colorValue, setColorAtom] = useAtom(colorAtom);

  const toggleTheme = () => {
    setColorAtom(!colorValue);
  };

  const themeIconName = colorValue ? 'white-balance-sunny' : 'moon-waning-crescent';
  const themeIconColor = colorValue ? 'yellow' : '#555';

  return (
    <Appbar.Header style={{ backgroundColor: theme.color1 }}>
      <Appbar.Action icon="menu" onPress={() => { }} />
      <Appbar.Content title="Don't snack" color={theme.color2} titleStyle={styles.title} />
      <Pressable style={styles.themeToggle}>
        <MaterialCommunityIcons
          onPress={toggleTheme}
          name={themeIconName}
          size={24}
          color={themeIconColor}
        />
      </Pressable>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SpaceMono',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  themeToggle: {
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
