import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Home, Users, Trophy, User } from 'lucide-react-native';
import { GlassPanel } from './GlassPanel';
import { colors } from '../theme/colors';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence, Easing } from 'react-native-reanimated';

interface TabItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onPress: () => void;
}

function TabItem({ label, icon, isActive = false, onPress }: TabItemProps) {
  const scale = useSharedValue(isActive ? 1.1 : 1);
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  React.useEffect(() => {
    scale.value = withTiming(isActive ? 1.1 : 1, { duration: 300 });
    opacity.value = withTiming(isActive ? 1 : 0.5, { duration: 300 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(isActive ? 1.1 : 1, { duration: 100 })
    );
  };

  return (
    <Pressable onPressIn={handlePressIn} onPress={onPress} className="items-center justify-center flex-1 py-3">
      <Animated.View style={animatedStyle} className="items-center justify-center relative">
        {isActive && (
          <View style={styles.activeGlow} />
        )}
        {icon}
        <Text 
          className={`text-[10px] mt-1 font-space uppercase tracking-wider ${isActive ? 'text-neonCyan font-bold' : 'text-textSecondary'}`}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function BottomNav() {
  const [activeTab, setActiveTab] = React.useState('Heroes');

  return (
    <View className="absolute bottom-6 left-4 right-4 z-50">
      <GlassPanel intensity={40} className="flex-row items-center justify-between rounded-full border border-white/10 overflow-visible px-2">
        <TabItem 
          label="Home" 
          icon={<Home color={activeTab === 'Home' ? colors.neonCyan : colors.textSecondary} size={22} />} 
          isActive={activeTab === 'Home'}
          onPress={() => setActiveTab('Home')}
        />
        <TabItem 
          label="Heroes" 
          icon={<Users color={activeTab === 'Heroes' ? colors.neonCyan : colors.textSecondary} size={22} />} 
          isActive={activeTab === 'Heroes'}
          onPress={() => setActiveTab('Heroes')}
        />
        <TabItem 
          label="Ranked" 
          icon={<Trophy color={activeTab === 'Ranked' ? colors.neonCyan : colors.textSecondary} size={22} />} 
          isActive={activeTab === 'Ranked'}
          onPress={() => setActiveTab('Ranked')}
        />
        <TabItem 
          label="Profile" 
          icon={<User color={activeTab === 'Profile' ? colors.neonCyan : colors.textSecondary} size={22} />} 
          isActive={activeTab === 'Profile'}
          onPress={() => setActiveTab('Profile')}
        />
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  activeGlow: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neonCyan,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
    opacity: 0.2, // very subtle background glow behind the icon
  }
});
