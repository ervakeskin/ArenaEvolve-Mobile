import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';

interface GlassPanelProps extends ViewProps {
  intensity?: number;
  children: React.ReactNode;
  className?: string; // for NativeWind
  blurTint?: 'light' | 'dark' | 'default';
  animatedStyle?: any;
  style?: StyleProp<ViewStyle>;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function GlassPanel({
  intensity = 50,
  children,
  className = '',
  blurTint = 'dark',
  animatedStyle,
  style,
  ...rest
}: GlassPanelProps) {
  return (
    <AnimatedBlurView
      intensity={intensity}
      tint={blurTint}
      style={[styles.container, animatedStyle, style]}
      className={`rounded-xl overflow-hidden ${className}`}
      {...rest}
    >
      <View style={styles.borderOverlay} />
      <View style={styles.highlightOverlay} />
      {children}
    </AnimatedBlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(8, 16, 36, 0.4)', // semi-transparent VoidBlue
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12, // match rounded-xl approximate
  },
  highlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  }
});
