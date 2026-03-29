import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Sparkles } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useHeroIdleAnimation } from '../hooks/useHeroAnimation';
import { GlassPanel } from './GlassPanel';

export function HeroCard() {
  const { animatedStyle } = useHeroIdleAnimation();

  return (
    <View className="items-center justify-center flex-1 w-full relative">
      <Animated.View style={[styles.heroContainer, animatedStyle]}>
        {/* Mock image container since we don't have a real asset */}
        <View className="w-80 h-[450px] items-center justify-center relative">
          <LinearGradient
            colors={['transparent', 'rgba(139, 92, 246, 0.2)', 'transparent']}
            className="absolute inset-0 rounded-full"
          />
          <LinearGradient
            colors={['rgba(8, 16, 36, 0)', 'rgba(8, 16, 36, 1)']}
            className="absolute bottom-0 w-full h-32"
          />
          {/* We will just show a silhouette like placeholder */}
          <View className="w-64 h-96 bg-white/5 rounded-[40px] items-center justify-center border border-white/10 shadow-lg" style={styles.imageGlow}>
            <Sparkles color={colors.arcanePurple} size={48} />
          </View>
        </View>

        {/* Hero Info Overlay */}
        <View className="absolute bottom-10 items-center justify-center w-full px-6">
          <GlassPanel intensity={50} className="px-6 py-2 rounded-full flex-row items-center mb-4">
            <Sparkles color={colors.legendaryGold} size={16} fill={colors.legendaryGold} />
            <Text className="text-legendaryGold font-space font-bold ml-2 tracking-widest uppercase text-xs">
              Legendary
            </Text>
          </GlassPanel>
          
          <Text style={[styles.heroName, styles.textGlow]}>
            SHADOW EMPRESS
          </Text>

          <View className="flex-row items-center mt-3 space-x-4">
            <View className="flex-row items-center">
              <Shield color={colors.neonCyan} size={14} />
              <Text className="text-neonCyan ml-1.5 font-space font-bold uppercase text-xs">Mage / Assassin</Text>
            </View>
            <View className="h-4 w-px bg-white/20 mx-3" />
            <View className="bg-white/10 px-2.5 py-1 rounded flex-row items-center border border-white/20">
              <Text className="text-white font-space font-bold text-xs uppercase">LVL 30</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontFamily: 'Space Grotesk',
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 2,
    textAlign: 'center',
  },
  textGlow: {
    textShadowColor: colors.arcanePurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  imageGlow: {
    shadowColor: colors.arcanePurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  }
});
