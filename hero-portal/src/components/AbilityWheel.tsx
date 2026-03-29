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
  onLongPress: () => void;
}

function SkillNode({ icon, level, isUltimate = false, onLongPress }: SkillNodeProps) {
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
    <Pressable onLongPress={onLongPress} delayLongPress={200} className="items-center justify-center relative mx-2">
      {isUltimate && (
        <Animated.View style={[styles.ultimateGlow, animatedGlowStyle]} />
      )}
      <GlassPanel 
        intensity={60} 
        className={`w-14 h-14 rounded-full items-center justify-center border-2 ${
          isUltimate ? 'border-legendaryGold/80' : 'border-white/20'
        }`}
      >
        {icon}
      </GlassPanel>
      <View className="absolute -bottom-2 bg-voidBlue border border-white/20 rounded-full w-5 h-5 items-center justify-center">
        <Text className="text-white text-[10px] font-bold font-space">{level}</Text>
      </View>
    </Pressable>
  );
}

export function AbilityWheel() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const renderTooltip = () => {
    if (!selectedSkill) return null;
    return (
      <Modal visible transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedSkill(null)}>
          <GlassPanel intensity={80} className="w-3/4 p-6 border border-white/20">
            <Text className="text-neonCyan font-space font-bold text-lg mb-2 uppercase">{selectedSkill}</Text>
            <Text className="text-white/80 font-space text-sm leading-relaxed">
              Deals heavy magic damage and summons a void entity that silences enemies for 1.5s.
              {"\n\n"}Cooldown: 12s | Cost: 60 Mana
            </Text>
          </GlassPanel>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View className="flex-row items-center justify-center w-full mt-6 mb-4">
      <SkillNode 
        icon={<Flame color={colors.textSecondary} size={24} />} 
        level={3} 
        onLongPress={() => setSelectedSkill("Phantom Strike")} 
      />
      <SkillNode 
        icon={<Wind color={colors.textSecondary} size={24} />} 
        level={2} 
        onLongPress={() => setSelectedSkill("Void Dash")} 
      />
      <SkillNode 
        icon={<Zap color={colors.textSecondary} size={24} />} 
        level={4} 
        onLongPress={() => setSelectedSkill("Arcane Overload")} 
      />
      <SkillNode 
        icon={<Skull color={colors.legendaryGold} size={28} />} 
        level={3} 
        isUltimate 
        onLongPress={() => setSelectedSkill("EMPRESS' WRATH")} 
      />
      {renderTooltip()}
    </View>
  );
}

const styles = StyleSheet.create({
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
