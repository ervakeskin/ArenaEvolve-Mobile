import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Sparkles, Shield } from 'lucide-react-native';
import { RootStackParamList } from '../../App';
import { colors } from '../theme/colors';
import { NeonButton } from '../components/NeonButton';
import { GlassPanel } from '../components/GlassPanel';

type Props = NativeStackScreenProps<RootStackParamList, 'Entry'>;

export function EntryScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.voidBlue, '#11192F', '#090513']} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroMark}>
          <Sparkles color={colors.legendaryGold} size={44} />
          <Text style={styles.title}>MLBB Lite Portal</Text>
          <Text style={styles.subtitle}>Shadow Empress Command Deck</Text>
        </View>

        <GlassPanel intensity={45} style={styles.missionPanel}>
          <View style={styles.missionHeader}>
            <Shield color={colors.neonCyan} size={16} />
            <Text style={styles.missionTitle}>Mission Brief</Text>
          </View>
          <Text style={styles.missionText}>
            Kahramanını seç, yeteneklerini incele ve arena için hazır ol. Bu panel MLBB tarzında hızlı karar akışı için optimize edildi.
          </Text>
        </GlassPanel>

        <View style={styles.actions}>
          <NeonButton
            title="Enter Lobby"
            onPress={() => navigation.navigate('HeroPortal')}
            variant="primary"
            style={styles.enterButton}
          />
        </View>
      </SafeAreaView>
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 36,
  },
  heroMark: {
    marginTop: 80,
    alignItems: 'center',
  },
  title: {
    marginTop: 16,
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  missionPanel: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionTitle: {
    marginLeft: 8,
    color: colors.neonCyan,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  missionText: {
    color: 'rgba(255,255,255,0.86)',
    lineHeight: 20,
    fontSize: 14,
  },
  actions: {
    width: '100%',
  },
  enterButton: {
    width: '100%',
  },
});
