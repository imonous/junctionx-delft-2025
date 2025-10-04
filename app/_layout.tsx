import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'JunctionX Delft 2025' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
