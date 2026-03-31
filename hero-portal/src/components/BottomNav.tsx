import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Home, Users, Trophy, User } from 'lucide-react-native';
import { GlassPanel } from './GlassPanel';
import { colors } from '../theme/colors';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence, Easing } from 'react-native-reanimated';

export type NavTab = 'Home' | 'Heroes' | 'Ranked' | 'Profile';

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
    <Pressable onPressIn={handlePressIn} onPress={onPress} style={styles.tabItem}>
      <Animated.View style={[animatedStyle, styles.tabInner]}>
        {isActive && (
          <View style={styles.activeGlow} />
        )}
        {icon}
        <Text style={[styles.tabText, isActive ? styles.activeText : styles.inactiveText]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {

  return (
    <View style={styles.navContainer}>
      <GlassPanel intensity={40} style={styles.navPanel}>
        <TabItem 
          label="Home" 
          icon={<Home stroke={activeTab === 'Home' ? colors.neonCyan : colors.textSecondary} size={22} />} 
          isActive={activeTab === 'Home'}
          onPress={() => onTabChange('Home')}
        />
        <TabItem 
          label="Heroes" 
          icon={<Users stroke={activeTab === 'Heroes' ? colors.neonCyan : colors.textSecondary} size={22} />} 
          isActive={activeTab === 'Heroes'}
          onPress={() => onTabChange('Heroes')}
        />
        <TabItem 
          label="Ranked" 
          icon={<Trophy stroke={activeTab === 'Ranked' ? colors.neonCyan : colors.textSecondary} size={22} />} 
          isActive={activeTab === 'Ranked'}
          onPress={() => onTabChange('Ranked')}
        />
        <TabItem 
          label="Profile" 
          icon={<User stroke={activeTab === 'Profile' ? colors.neonCyan : colors.textSecondary} size={22} />} 
          isActive={activeTab === 'Profile'}
          onPress={() => onTabChange('Profile')}
        />
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 50,
  },
  navPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'visible',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  activeText: {
    color: colors.neonCyan,
    fontWeight: '700',
  },
  inactiveText: {
    color: colors.textSecondary,
  },
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
