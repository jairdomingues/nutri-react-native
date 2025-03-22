import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

// Custom tab button para destacar o acompanhamento nutricional
function PremiumTabButton(props) {
  return (
    <TouchableOpacity 
      style={{ 
        alignItems: 'center',
        marginTop: -20,
      }}
      onPress={props.onPress}
      activeOpacity={0.7}
    >
      <View style={{
        backgroundColor: '#4CAF50',
        borderRadius: 30,
        padding: 8,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}>
        <Ionicons name="nutrition" size={28} color="white" />
      </View>
      <Text style={{ color: props.focused ? Colors.light.tint : '#888', fontSize: 12, fontWeight: props.focused ? 'bold' : 'normal', marginTop: 2 }}>
        Nutricionista
      </Text>
      <View style={{
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FFD700',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
      }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#333' }}>PRO</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="acompanhamento"
        options={{
          title: 'Nutricionista',
          tabBarButton: PremiumTabButton,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
