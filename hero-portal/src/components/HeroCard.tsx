import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useHeroIdleAnimation } from '../hooks/useHeroAnimation';
import { GlassPanel } from './GlassPanel';

export interface HeroProfile {
  name: string;
  role: string;
  level: number;
  rarity: string;
  accentColor: string;
  emblem: string;
}

interface HeroCardProps {
  hero: HeroProfile;
}

export function HeroCard({ hero }: HeroCardProps) {
  const { animatedStyle } = useHeroIdleAnimation();

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.heroContainer, animatedStyle]}>
        <View style={styles.visualContainer}>
          <LinearGradient
            colors={['transparent', `${hero.accentColor}44`, 'transparent']}
            style={styles.ambientAura}
          />
          <LinearGradient
            colors={['rgba(8, 16, 36, 0)', 'rgba(8, 16, 36, 1)']}
            style={styles.bottomFade}
          />
          <View style={[styles.silhouetteCard, styles.imageGlow]}>
            <Text style={[styles.heroEmblem, { color: hero.accentColor }]}>{hero.emblem}</Text>
          </View>
        </View>

        <View style={styles.infoOverlay}>
          <GlassPanel intensity={50} style={styles.badgePanel}>
            <Text style={styles.badgeText}>
              {hero.rarity}
            </Text>
          </GlassPanel>
          
          <Text style={[styles.heroName, styles.textGlow]}>
            {hero.name}
          </Text>

          <View style={styles.roleRow}>
            <View style={styles.roleInfo}>
              <Shield stroke={hero.accentColor} size={14} />
              <Text style={[styles.roleText, { color: hero.accentColor }]}>{hero.role}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.levelPill}>
              <Text style={styles.levelText}>LVL {hero.level}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  visualContainer: {
    width: 320,
    height: 450,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ambientAura: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 180,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 128,
  },
  silhouetteCard: {
    width: 256,
    height: 384,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroEmblem: {
    fontSize: 68,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  badgePanel: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeText: {
    marginLeft: 8,
    color: colors.legendaryGold,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 11,
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
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    color: colors.neonCyan,
    marginLeft: 6,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 11,
  },
  divider: {
    height: 16,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 12,
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  levelText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },
});
