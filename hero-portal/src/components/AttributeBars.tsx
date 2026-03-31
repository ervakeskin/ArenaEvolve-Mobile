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
    width: ((progress.value * 100) + '%') as any,
  }));

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedOpacityStyle, styles.attributeItem]}>
      <View style={styles.rowBetween}>
        <Text style={styles.attributeLabel}>
          {label}
        </Text>
        <Text style={[styles.attributeValue, { color, textShadowColor: color }]}>
          {value}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View 
          style={[{ backgroundColor: color }, animatedProgressStyle, styles.glowShadow, styles.fill]}
        />
      </View>
    </Animated.View>
  );
}

export function AttributeBars() {
  return (
    <View style={styles.container}>
      <AttributeBar label="Offense" value={85} max={100} color={colors.arcanePurple} delayMs={100} />
      <AttributeBar label="Magic" value={98} max={100} color={colors.neonCyan} delayMs={200} />
      <AttributeBar label="Defense" value={45} max={100} color={colors.legendaryGold} delayMs={300} />
      <AttributeBar label="Speed" value={76} max={100} color={colors.white} delayMs={400} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    marginTop: 16,
  },
  attributeItem: {
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  attributeLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  attributeValue: {
    fontSize: 12,
    fontWeight: '700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  glowShadow: {
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 4,
  }
});
