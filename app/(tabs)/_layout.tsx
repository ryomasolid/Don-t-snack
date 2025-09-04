import { CustomHeader } from '@/components/CustomHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const commonHeaderOptions = {
    headerShown: true,
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute' as const,
      },
      default: {},
    }),
    header: () => <CustomHeader />,
  };

  return (
    <Tabs screenOptions={commonHeaderOptions}>
      {/* Checkタブ */}
      <Tabs.Screen
        name="check"
        options={{
          title: 'Check',
          tabBarIcon: ({ color }: { color: string; }) => <TabBarIcon name="pencil-circle" color={color} />,
        }}
      />
      {/* Calendarタブ */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'calendar',
          tabBarIcon: ({ color }: { color: string; }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
}