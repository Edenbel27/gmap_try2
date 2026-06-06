import { Stack } from 'expo-router';
import { GMAPProvider } from '@/shared/context';

export default function RootLayout() {
  return (
    <GMAPProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GMAPProvider>
  );
}
