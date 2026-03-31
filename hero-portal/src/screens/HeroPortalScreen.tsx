import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

// Components
import { CurrencyBar } from '../components/CurrencyBar';
import { HeroCard, HeroProfile } from '../components/HeroCard';
import { AttributeBars } from '../components/AttributeBars';
import { AbilityWheel, AbilityData } from '../components/AbilityWheel';
import { NeonButton } from '../components/NeonButton';
import { BottomNav, NavTab } from '../components/BottomNav';
import { useMountAnimation } from '../hooks/useHeroAnimation';
import { colors } from '../theme/colors';

// Simple Floating Particle
interface ParticleProps {
  delay: number;
  initX: number | `${number}%`;
  initY: number;
  size: number;
  duration: number;
}

function Particle({ delay, initX, initY, size, duration }: ParticleProps) {
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
  const [activeTab, setActiveTab] = React.useState<NavTab>('Heroes');
  const [skinPreviewEnabled, setSkinPreviewEnabled] = React.useState(false);
  const [selectedHeroIndex, setSelectedHeroIndex] = React.useState(0);

  const heroes: HeroProfile[] = React.useMemo(
    () => [
      { name: 'Shadow Empress', role: 'Mage / Assassin', level: 30, rarity: 'Legendary', accentColor: colors.arcanePurple, emblem: 'SE' },
      { name: 'Blazing Ronin', role: 'Fighter / Jungler', level: 27, rarity: 'Epic', accentColor: '#FF7A00', emblem: 'BR' },
      { name: 'Frost Valkyrie', role: 'Marksman / Support', level: 29, rarity: 'Elite', accentColor: '#66CCFF', emblem: 'FV' },
    ],
    []
  );
  const selectedHero = heroes[selectedHeroIndex];

  const heroAbilities = React.useMemo<Record<'phantomStrike' | 'voidDash' | 'arcaneOverload' | 'empressWrath', AbilityData>>(
    () => ({
      phantomStrike: {
        label: selectedHero.name === 'Blazing Ronin' ? 'Inferno Slash' : selectedHero.name === 'Frost Valkyrie' ? 'Glacier Arrow' : 'Phantom Strike',
        description: selectedHero.name === 'Blazing Ronin'
          ? 'Yakın menzilde alev hasarı verir ve hedefi işaretler.'
          : selectedHero.name === 'Frost Valkyrie'
          ? 'Yavaşlatan buz oku atar ve hedefe zincir etkisi bırakır.'
          : 'Deals heavy magic damage and briefly marks the target.',
        cooldown: '8s',
        mana: 45,
      },
      voidDash: {
        label: selectedHero.name === 'Blazing Ronin' ? 'Flame Dash' : selectedHero.name === 'Frost Valkyrie' ? 'Ice Shift' : 'Void Dash',
        description: 'Hızlı pozisyon değiştirir ve kısa süreli hareket bonusu sağlar.',
        cooldown: '10s',
        mana: 40,
      },
      arcaneOverload: {
        label: selectedHero.name === 'Blazing Ronin' ? 'Molten Surge' : selectedHero.name === 'Frost Valkyrie' ? 'Crystal Barrage' : 'Arcane Overload',
        description: 'Yüklenerek geniş alana hasar veren bir enerji patlaması salar.',
        cooldown: '12s',
        mana: 60,
      },
      empressWrath: {
        label: selectedHero.name === 'Blazing Ronin' ? "RONIN'S OATH" : selectedHero.name === 'Frost Valkyrie' ? 'VALKYRIE AEGIS' : "EMPRESS' WRATH",
        description: 'Ultimate yetenek: takım savaşını belirleyen yüksek etki üretir.',
        cooldown: '24s',
        mana: 100,
      },
    }),
    [selectedHero.name]
  );

  const handleSelectHero = React.useCallback(() => {
    Alert.alert('Hero Selected', `${selectedHero.name} takıma eklendi.`);
  }, [selectedHero.name]);

  const handleSkinPreview = React.useCallback(() => {
    const next = !skinPreviewEnabled;
    setSkinPreviewEnabled(next);
    Alert.alert('Skin Preview', next ? 'Arcane skin aktif.' : 'Varsayılan skin aktif.');
  }, [skinPreviewEnabled]);

  const handleStartBattle = React.useCallback(() => {
    Alert.alert('Battle Queue', `${selectedHero.name} ile eşleşme aranıyor...`);
  }, [selectedHero.name]);

  const renderHeroSelector = () => (
    <View style={styles.heroPickerRow}>
      {heroes.map((hero, index) => {
        const isActive = index === selectedHeroIndex;
        return (
          <Pressable
            key={hero.name}
            onPress={() => setSelectedHeroIndex(index)}
            style={[styles.heroChip, isActive && styles.heroChipActive]}
          >
            <Text style={[styles.heroChipText, isActive && styles.heroChipTextActive]}>{hero.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderHomeTab = () => (
    <View style={styles.tabSection}>
      <Text style={styles.sectionTitle}>Quick Match Lobby</Text>
      <Text style={styles.sectionBody}>Gunun metasina uygun kahraman secimi yap ve hizli savasa gir.</Text>
      {renderHeroSelector()}
      <NeonButton title="START BATTLE" onPress={handleStartBattle} variant="primary" style={styles.fullButton} />
    </View>
  );

  const renderHeroesTab = () => (
    <>
      <Animated.View style={[{ flex: 1, minHeight: 460 }, mountStyleHero]}>
        <HeroCard hero={selectedHero} />
      </Animated.View>
      {renderHeroSelector()}
      <Animated.View style={[mountStyleAttrs, styles.sectionPadding]}>
        <AttributeBars />
        <AbilityWheel abilities={heroAbilities} />
      </Animated.View>
      <Animated.View style={[mountStyleActions, styles.actionSection]}>
        <NeonButton title="SELECT HERO" onPress={handleSelectHero} variant="primary" style={styles.fullButton} />
        <NeonButton
          title={skinPreviewEnabled ? 'SKIN ACTIVE' : 'SKIN PREVIEW'}
          onPress={handleSkinPreview}
          variant="secondary"
          style={styles.fullButton}
        />
      </Animated.View>
    </>
  );

  const renderRankedTab = () => (
    <View style={styles.tabSection}>
      <Text style={styles.sectionTitle}>Ranked Preparation</Text>
      <Text style={styles.sectionBody}>Current Tier: Mythic V - Win streak bonus aktif.</Text>
      <NeonButton title="START RANKED" onPress={handleStartBattle} variant="primary" style={styles.fullButton} />
    </View>
  );

  const renderProfileTab = () => (
    <View style={styles.tabSection}>
      <Text style={styles.sectionTitle}>Commander Profile</Text>
      <Text style={styles.sectionBody}>Mains: {heroes.map((h) => h.name).join(', ')}</Text>
      <Text style={styles.sectionBody}>Season Win Rate: 61.4%</Text>
    </View>
  );

  const renderTabContent = () => {
    if (activeTab === 'Home') return renderHomeTab();
    if (activeTab === 'Ranked') return renderRankedTab();
    if (activeTab === 'Profile') return renderProfileTab();
    return renderHeroesTab();
  };

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
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 40}} showsVerticalScrollIndicator={false}>
          <CurrencyBar />
          {renderTabContent()}
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.voidBlue,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 96,
    position: 'relative',
  },
  sectionPadding: {
    paddingHorizontal: 16,
  },
  actionSection: {
    paddingHorizontal: 24,
    marginTop: 16,
    gap: 12,
  },
  fullButton: {
    width: '100%',
  },
  tabSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionBody: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 6,
  },
  heroChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroChipActive: {
    borderColor: colors.neonCyan,
    backgroundColor: 'rgba(0,255,255,0.15)',
  },
  heroChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  heroChipTextActive: {
    color: colors.neonCyan,
  },
});
