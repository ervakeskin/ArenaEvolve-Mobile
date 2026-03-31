import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet, Modal } from 'react-native';
import { GlassPanel } from './GlassPanel';
import { Flame, Wind, Zap, Skull } from 'lucide-react-native';
import { colors } from '../theme/colors';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';

interface SkillNodeProps {
  icon: React.ReactNode;
  level: number;
  isUltimate?: boolean;
  onTrigger: () => void;
}

export interface AbilityData {
  label: string;
  description: string;
  cooldown: string;
  mana: number;
}

function SkillNode({ icon, level, isUltimate = false, onTrigger }: SkillNodeProps) {
  const glowOpacity = useSharedValue(0.5);

  React.useEffect(() => {
    if (isUltimate) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [isUltimate]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Pressable
      onPress={onTrigger}
      onLongPress={onTrigger}
      delayLongPress={200}
      style={styles.skillPressable}
    >
      {isUltimate && (
        <Animated.View style={[styles.ultimateGlow, animatedGlowStyle]} />
      )}
      <GlassPanel 
        intensity={60} 
        style={[styles.skillNode, isUltimate ? styles.ultimateBorder : styles.defaultBorder]}
      >
        {icon}
      </GlassPanel>
      <View style={styles.levelBadge}>
        <Text style={styles.levelBadgeText}>{level}</Text>
      </View>
    </Pressable>
  );
}

interface AbilityWheelProps {
  abilities?: Record<AbilityKey, AbilityData>;
}

export function AbilityWheel({ abilities: externalAbilities }: AbilityWheelProps) {
  const [selectedSkill, setSelectedSkill] = useState<AbilityKey | null>(null);

  const abilities: Record<AbilityKey, AbilityData> = externalAbilities ?? {
    phantomStrike: {
      label: 'Phantom Strike',
      description: 'Deals heavy magic damage and briefly marks the target.',
      cooldown: '8s',
      mana: 45,
    },
    voidDash: {
      label: 'Void Dash',
      description: 'Dashes through enemies and grants short burst movement speed.',
      cooldown: '10s',
      mana: 40,
    },
    arcaneOverload: {
      label: 'Arcane Overload',
      description: 'Charges and releases a ranged blast that pierces minions.',
      cooldown: '12s',
      mana: 60,
    },
    empressWrath: {
      label: "EMPRESS' WRATH",
      description: 'Summons a void entity that silences enemies for 1.5s.',
      cooldown: '24s',
      mana: 100,
    },
  };

  const renderTooltip = () => {
    if (!selectedSkill) return null;
    const skill = abilities[selectedSkill];
    return (
      <Modal visible transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedSkill(null)}>
          <GlassPanel intensity={80} style={styles.tooltipPanel}>
            <Text style={styles.tooltipTitle}>{skill.label}</Text>
            <Text style={styles.tooltipBody}>
              {skill.description}
              {"\n\n"}Cooldown: {skill.cooldown} | Cost: {skill.mana} Mana
            </Text>
          </GlassPanel>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View style={styles.root}>
      <SkillNode 
        icon={<Flame color={colors.textSecondary} size={24} />} 
        level={3} 
        onTrigger={() => setSelectedSkill('phantomStrike')} 
      />
      <SkillNode 
        icon={<Wind color={colors.textSecondary} size={24} />} 
        level={2} 
        onTrigger={() => setSelectedSkill('voidDash')} 
      />
      <SkillNode 
        icon={<Zap color={colors.textSecondary} size={24} />} 
        level={4} 
        onTrigger={() => setSelectedSkill('arcaneOverload')} 
      />
      <SkillNode 
        icon={<Skull color={colors.legendaryGold} size={28} />} 
        level={3} 
        isUltimate 
        onTrigger={() => setSelectedSkill('empressWrath')} 
      />
      {renderTooltip()}
    </View>
  );
}

type AbilityKey = 'phantomStrike' | 'voidDash' | 'arcaneOverload' | 'empressWrath';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 24,
    marginBottom: 16,
  },
  skillPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 8,
  },
  skillNode: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  defaultBorder: {
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ultimateBorder: {
    borderColor: 'rgba(255,215,0,0.8)',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: colors.voidBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  tooltipPanel: {
    width: '75%',
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tooltipTitle: {
    color: colors.neonCyan,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  tooltipBody: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 20,
  },
  ultimateGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.legendaryGold,
    shadowColor: colors.legendaryGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
