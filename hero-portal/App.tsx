import "./global.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeroPortalScreen } from './src/screens/HeroPortalScreen';
import { EntryScreen } from './src/screens/EntryScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import BattleScreen from './src/screens/BattleScreen';

// Burası navigasyonun kimlik kartı
export type RootStackParamList = {
  Entry: undefined;
  HeroPortal: undefined;
  Battle: { heroId: string }; // Hangi kahramanla savaşa girildiğini burası taşır
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          initialRouteName="Entry" // Uygulama giriş ekranıyla başlasın
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          <Stack.Screen name="Entry" component={EntryScreen} />
          <Stack.Screen name="HeroPortal" component={HeroPortalScreen} />
          {/* Yeni eklediğimiz Arena kapısı burada: */}
          <Stack.Screen name="Battle" component={BattleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}