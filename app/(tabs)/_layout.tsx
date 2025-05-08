// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
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
    />
  );
}
