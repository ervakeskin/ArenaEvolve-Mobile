import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface AttributeProps {
  label: string;
  value: number;
  max: number;
  color: string;
  delayMs?: number;
}

function AttributeBar({ label, value, max, color, delayMs = 0 }: AttributeProps) {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delayMs, withTiming(1, { duration: 400 }));
    progress.value = withDelay(
      delayMs + 100,
      withTiming(value / max, { duration: 1000, easing: Easing.out(Easing.cubic) })
    );
  }, [value, max, delayMs]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedOpacityStyle} className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-white text-xs font-space font-medium tracking-widest uppercase">
          {label}
        </Text>
        <Text style={{ color, textShadowColor: color, textShadowOffset: {width: 0, height: 0}, textShadowRadius: 6 }} className="text-xs font-space font-bold">
          {value}
        </Text>
      </View>
      <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <Animated.View 
          style={[{ backgroundColor: color }, animatedProgressStyle, styles.glowShadow]} 
          className="h-full rounded-full"
        />
      </View>
    </Animated.View>
  );
}

export function AttributeBars() {
  return (
    <View className="px-4 py-2 w-full mt-4">
      <AttributeBar label="Offense" value={85} max={100} color={colors.arcanePurple} delayMs={100} />
      <AttributeBar label="Magic" value={98} max={100} color={colors.neonCyan} delayMs={200} />
      <AttributeBar label="Defense" value={45} max={100} color={colors.legendaryGold} delayMs={300} />
      <AttributeBar label="Speed" value={76} max={100} color={colors.white} delayMs={400} />
    </View>
  );
}

const styles = StyleSheet.create({
  glowShadow: {
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 4,
  }
});
