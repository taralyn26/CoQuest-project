import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#56018D',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'map':
              return <Ionicons name="map-outline" size={size} color={color} />;
            case 'new-quest':
              return <Ionicons name="add-circle-outline" size={size} color={color} />;
            case 'profile':
              return <Ionicons name="person-circle-outline" size={size} color={color} />;
            case 'settings':
              return <Ionicons name="settings-outline" size={size} color={color} />;
            case 'quest-dashboard':
              return <Ionicons name="list-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="new-quest" options={{ title: 'New Quest' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="quest-dashboard" options={{ title: 'Dashboard' }} />
    </Tabs>
  );
}
