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
    <View style={styles.container}>
      <AnimatedPressable style={styles.backButton}>
        <Animated.View style={[styles.backGlow, animatedGlowStyle]} />
        <GlassPanel intensity={30} style={styles.iconPanel}>
          <ChevronLeft stroke={colors.neonCyan} size={24} />
        </GlassPanel>
      </AnimatedPressable>

      <View style={styles.currencyRow}>
        <GlassPanel intensity={40} style={styles.diamondPill}>
          <Diamond stroke={colors.neonCyan} size={16} fill={colors.neonCyan} />
          <Text style={styles.pillText}>1,250</Text>
        </GlassPanel>

        <GlassPanel intensity={40} style={styles.goldPill}>
          <Coins stroke={colors.legendaryGold} size={16} />
          <Text style={styles.pillText}>24,500</Text>
        </GlassPanel>

        <Pressable style={styles.settingsButton}>
          <Settings stroke={colors.textSecondary} size={22} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
    width: '100%',
  },
  backButton: {
    position: 'relative',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPanel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diamondPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  goldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    marginLeft: 8,
  },
  pillText: {
    color: colors.white,
    fontWeight: '700',
    marginLeft: 6,
  },
  settingsButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
