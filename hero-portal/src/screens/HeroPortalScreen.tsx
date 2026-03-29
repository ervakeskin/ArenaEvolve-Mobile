import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

// Components
import { CurrencyBar } from '../components/CurrencyBar';
import { HeroCard } from '../components/HeroCard';
import { AttributeBars } from '../components/AttributeBars';
import { AbilityWheel } from '../components/AbilityWheel';
import { NeonButton } from '../components/NeonButton';
import { BottomNav } from '../components/BottomNav';
import { useMountAnimation } from '../hooks/useHeroAnimation';
import { colors } from '../theme/colors';

// Simple Floating Particle
function Particle({ delay, initX, initY, size, duration }: any) {
  const translateY = useSharedValue(initY);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.4, { duration: 800 }));
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(initY - 100, { duration, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: initX,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.neonCyan,
          shadowColor: colors.neonCyan,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
        },
        animatedStyle,
      ]}
    />
  );
}

export function HeroPortalScreen() {
  const { animatedStyle: mountStyleHero } = useMountAnimation(200);
  const { animatedStyle: mountStyleAttrs } = useMountAnimation(500);
  const { animatedStyle: mountStyleActions } = useMountAnimation(700);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background System */}
      <LinearGradient
        colors={[colors.voidBlue, '#131A30', '#0A051A']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Particles effect */}
      <Particle delay={0} initX="10%" initY={300} size={4} duration={8000} />
      <Particle delay={400} initX="80%" initY={400} size={6} duration={12000} />
      <Particle delay={1200} initX="30%" initY={600} size={3} duration={9000} />
      <Particle delay={2000} initX="70%" initY={200} size={5} duration={15000} />
      
      {/* Content wrapper */}
      <SafeAreaView className="flex-1 pb-24 relative">
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 40}} showsVerticalScrollIndicator={false}>
          {/* Top HUD */}
          <CurrencyBar />

          {/* Center Stage: Hero Card */}
          <Animated.View style={[{flex: 1, minHeight: 460}, mountStyleHero]}>
            <HeroCard />
          </Animated.View>

          {/* Stats Section */}
          <Animated.View style={mountStyleAttrs} className="px-4">
            <AttributeBars />
            
            {/* Ability Wheel */}
            <AbilityWheel />
          </Animated.View>

          {/* Action Footer */}
          <Animated.View style={mountStyleActions} className="px-6 mt-4 gap-y-4">
            <NeonButton 
              title="SELECT HERO" 
              onPress={() => console.log('Hero Selected')} 
              variant="primary" 
              className="w-full"
            />
            <NeonButton 
              title="SKIN PREVIEW" 
              onPress={() => console.log('Skin Preview')} 
              variant="secondary" 
              className="w-full"
            />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Persistent Bottom Tab (Mocked) */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.voidBlue,
  }
});
