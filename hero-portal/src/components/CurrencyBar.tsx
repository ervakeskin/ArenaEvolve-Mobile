import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GlassPanel } from './GlassPanel';
import { ChevronLeft, Settings, Diamond, Coins } from 'lucide-react-native';
import { colors } from '../theme/colors';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CurrencyBar() {
  const glowOpacity = useSharedValue(0.4);

  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View className="flex-row items-center justify-between px-4 py-2 mt-2 w-full">
      {/* Back Button */}
      <AnimatedPressable className="relative w-12 h-12 items-center justify-center">
        <Animated.View style={[styles.backGlow, animatedGlowStyle]} />
        <GlassPanel intensity={30} className="w-10 h-10 rounded-full items-center justify-center">
          <ChevronLeft color={colors.neonCyan} size={24} />
        </GlassPanel>
      </AnimatedPressable>

      {/* Currency Pills */}
      <View className="flex-row items-center space-x-3">
        {/* Diamond Pill */}
        <GlassPanel intensity={40} className="flex-row items-center px-3 py-1.5 rounded-full border border-arcanePurple/30">
          <Diamond color={colors.neonCyan} size={16} fill={colors.neonCyan} />
          <Text className="text-white font-bold ml-1.5 font-space">1,250</Text>
        </GlassPanel>

        {/* Gold Pill */}
        <GlassPanel intensity={40} className="flex-row items-center px-3 py-1.5 rounded-full border border-legendaryGold/30 ml-2">
          <Coins color={colors.legendaryGold} size={16} />
          <Text className="text-white font-bold ml-1.5 font-space">24,500</Text>
        </GlassPanel>

        {/* Settings */}
        <Pressable className="ml-2 w-10 h-10 items-center justify-center">
          <Settings color={colors.textSecondary} size={22} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neonCyan,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  }
});
