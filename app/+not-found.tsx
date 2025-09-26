import { ContainerComponent } from '@/components/ContainerComponent';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, } from 'react-native';

export default function NotFoundScreen() {
  return (
    <ContainerComponent style={styles.container}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text >Oops! This screen does not exist.</Text>
      <Link href="/" style={styles.link}>
        <Text >Go back to Home</Text>
      </Link>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  link: {
    marginTop: 20,
  },
});
