import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useGameStore } from '../store/useGameStore';
import { calculateBattleTurn } from '../logic/battleEngine';
import { HeroStats } from '../types/game';

// ─── Types ────────────────────────────────────────────────────────────────────

type RootStackParamList = {
  Battle: { heroId: string };
};

type BattleScreenRouteProp = RouteProp<RootStackParamList, 'Battle'>;

type LogEntry = {
  id: number;
  message: string;
  type: 'system' | 'attack' | 'victory' | 'info';
};

// ─── Constants ────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NEON_CYAN   = '#00e5ff';
const NEON_RED    = '#ff1744';
const NEON_GOLD   = '#ffd600';
const NEON_GREEN  = '#76ff03';
const BG_DEEP     = '#060b14';
const BG_CARD     = '#0a1628';
const BG_PANEL    = '#071020';
const BORDER_DIM  = '#1a2a40';

const DEFAULT_PLAYER_STATS: HeroStats = {
  hp: 1000,
  mana: 500,
  atkPhysical: 120,
  atkMagic: 0,
  def: 50,
  speed: 10,
};

const DEFAULT_ENEMY_STATS: HeroStats = {
  hp: 800,
  mana: 300,
  atkPhysical: 80,
  atkMagic: 0,
  def: 30,
  speed: 8,
};

const PLAYER_MAX_HP = DEFAULT_PLAYER_STATS.hp;
const ENEMY_MAX_HP  = DEFAULT_ENEMY_STATS.hp;

const GOLD_REWARD = 150;
const DEFEAT_THRESHOLD = 0.15; // %15 şanslı vuruş = defeat

// ─── Sub-components ───────────────────────────────────────────────────────────

interface HealthBarProps {
  current: number;
  max: number;
  color: string;
  label: string;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, color, label }) => {
  const ratio = Math.max(0, Math.min(1, current / max));
  const animWidth = useRef(new Animated.Value(ratio)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: ratio,
      duration: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [ratio]);

  const barWidth = animWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={hbStyles.wrapper}>
      <View style={hbStyles.labelRow}>
        <Text style={hbStyles.label}>{label}</Text>
        <Text style={[hbStyles.value, { color }]}>
          {current} / {max}
        </Text>
      </View>
      <View style={hbStyles.track}>
        <Animated.View
          style={[
            hbStyles.fill,
            { width: barWidth, backgroundColor: color },
          ]}
        />
        <View style={[hbStyles.glow, { shadowColor: color }]} />
      </View>
    </View>
  );
};

const hbStyles = StyleSheet.create({
  wrapper:  { marginBottom: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label:    { color: '#8fafc8', fontSize: 11, letterSpacing: 1, fontWeight: '600', textTransform: 'uppercase' },
  value:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  track:    { height: 8, backgroundColor: '#0d1e30', borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: BORDER_DIM },
  fill:     { height: '100%', borderRadius: 4 },
  glow:     { ...StyleSheet.absoluteFillObject, shadowOpacity: 0.8, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
});

// ─── Log Item ─────────────────────────────────────────────────────────────────

interface LogItemProps {
  entry: LogEntry;
  index: number;
}

const LOG_COLORS: Record<LogEntry['type'], string> = {
  system:  '#4a90b0',
  attack:  '#c8d8e8',
  victory: NEON_GOLD,
  info:    '#6b8fa8',
};

const LogItem: React.FC<LogItemProps> = ({ entry, index }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
  }, []);

  const prefix = entry.type === 'victory' ? '🏆 ' : entry.type === 'attack' ? '⚔️  ' : '▸ ';

  return (
    <Animated.View style={[liStyles.row, { opacity, transform: [{ translateY }] }]}>
      <Text style={[liStyles.text, { color: LOG_COLORS[entry.type] }]}>
        {prefix}{entry.message}
      </Text>
    </Animated.View>
  );
};

const liStyles = StyleSheet.create({
  row:  { paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#0d1e30' },
  text: { fontSize: 13, lineHeight: 18, letterSpacing: 0.3 },
});

// ─── Neon Button ──────────────────────────────────────────────────────────────

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  color: string;
  disabled?: boolean;
  pulse?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({ label, onPress, color, disabled = false, pulse = false }) => {
  const scale      = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
    onPress();
  };

  return (
    <Animated.View style={[nbStyles.wrapper, { transform: [{ scale }] }]}>
      {/* Glow layer */}
      <Animated.View
        style={[
          nbStyles.glow,
          { backgroundColor: color, shadowColor: color, opacity: glowOpacity },
        ]}
      />
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={[
          nbStyles.btn,
          { borderColor: color },
          disabled && nbStyles.disabled,
        ]}
      >
        <Text style={[nbStyles.label, { color: disabled ? '#3a5060' : color }]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const nbStyles = StyleSheet.create({
  wrapper:  { position: 'relative', marginTop: 12 },
  glow:     {
    position: 'absolute', inset: -4,
    borderRadius: 14,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    opacity: 0.5,
  },
  btn:      {
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: BG_CARD,
  },
  label:    { fontSize: 15, fontWeight: '800', letterSpacing: 3, textTransform: 'uppercase' },
  disabled: { opacity: 0.4 },
});

// ─── Main BattleScreen ────────────────────────────────────────────────────────

type BattleState = 'idle' | 'fighting' | 'victory' | 'defeat';

const BattleScreen: React.FC = () => {
  const route     = useRoute<BattleScreenRouteProp>();
  const navigation = useNavigation();
  const { heroId } = route.params;

  const { addGold } = useGameStore();

  // ── Battle State ──
  const [logs, setLogs]         = useState<LogEntry[]>([
    { id: 0, message: 'Arena kapıları açıldı. Savaş başlasın!', type: 'system' },
  ]);
  const [battleState, setBattleState] = useState<BattleState>('idle');
  const [turnCount, setTurnCount]     = useState(0);
  const [playerHp, setPlayerHp]       = useState(DEFAULT_PLAYER_STATS.hp);
  const [enemyHp, setEnemyHp]         = useState(DEFAULT_ENEMY_STATS.hp);

  const logIdRef  = useRef(1);
  const scrollRef = useRef<ScrollView>(null);

  // ── Ambient Scan Line Animation ──
  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanLine, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const scanTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 500],
  });

  // ── Helpers ──
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'attack') => {
    const id = logIdRef.current++;
    setLogs(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 50);
  }, []);

  const handleAttack = useCallback(() => {
    if (battleState === 'victory' || battleState === 'defeat') return;

    setBattleState('fighting');
    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    // Player → Enemy
    const playerStats: HeroStats = { ...DEFAULT_PLAYER_STATS, hp: playerHp };
    const enemyStats:  HeroStats = { ...DEFAULT_ENEMY_STATS,  hp: enemyHp  };

    const playerResult = calculateBattleTurn(playerStats, enemyStats, 'Sen', 'Düşman');
    const newEnemyHp   = Math.max(0, enemyHp  - (playerResult.damageDealt ?? 0));
    setEnemyHp(newEnemyHp);
    addLog(playerResult.logMessage, 'attack');

    // Enemy → Player (counter)
    const enemyResult  = calculateBattleTurn(enemyStats, playerStats, 'Düşman', 'Sen');
    const newPlayerHp  = Math.max(0, playerHp - (enemyResult.damageDealt ?? 0));
    setPlayerHp(newPlayerHp);

    setTimeout(() => {
      addLog(enemyResult.logMessage, 'attack');

      // Victory check
      if (newEnemyHp <= 0) {
        setBattleState('victory');
        addGold(GOLD_REWARD);
        addLog(`⚡ ZAFER! Düşman yenildi. +${GOLD_REWARD} Altın kazandın!`, 'victory');
        return;
      }

      // Defeat check
      if (newPlayerHp <= 0 || Math.random() < DEFEAT_THRESHOLD) {
        setBattleState('defeat');
        addLog('💀 YENİLDİN! Daha güçlü geri dön...', 'system');
        return;
      }

      setBattleState('idle');
    }, 300);
  }, [battleState, turnCount, playerHp, enemyHp, addLog, addGold]);

  const handleReturn = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // ── Derived UI ──
  const isOver         = battleState === 'victory' || battleState === 'defeat';
  const isFighting     = battleState === 'fighting';
  const isVictory      = battleState === 'victory';
  const headerColor    = isVictory ? NEON_GOLD : battleState === 'defeat' ? NEON_RED : NEON_CYAN;
  const statusLabel    = isVictory ? '⚡ ZAFER' : battleState === 'defeat' ? '💀 YENİLDİN' : `TUR ${turnCount}`;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG_DEEP} />

      {/* Scan-line overlay */}
      <Animated.View
        pointerEvents="none"
        style={[styles.scanLine, { transform: [{ translateY: scanTranslate }] }]}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>HERO ID: {heroId}</Text>
        <Text style={[styles.headerTitle, { color: headerColor, textShadowColor: headerColor }]}>
          BATTLE ARENA
        </Text>
        <Text style={[styles.headerStatus, { color: headerColor }]}>{statusLabel}</Text>
      </View>

      {/* ── HP Panels ── */}
      <View style={styles.hpContainer}>
        <View style={[styles.hpCard, { borderColor: NEON_CYAN + '55' }]}>
          <Text style={[styles.hpName, { color: NEON_CYAN }]}>SEN</Text>
          <HealthBar
            current={playerHp}
            max={PLAYER_MAX_HP}
            color={NEON_GREEN}
            label="HP"
          />
        </View>
        <View style={styles.vsBox}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={[styles.hpCard, { borderColor: NEON_RED + '55' }]}>
          <Text style={[styles.hpName, { color: NEON_RED }]}>DÜŞMAN</Text>
          <HealthBar
            current={enemyHp}
            max={ENEMY_MAX_HP}
            color={NEON_RED}
            label="HP"
          />
        </View>
      </View>

      {/* ── Battle Log ── */}
      <View style={styles.logContainer}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>SAVAŞ LOGU</Text>
          <View style={[styles.logDot, { backgroundColor: isFighting ? NEON_CYAN : '#334' }]} />
        </View>
        <ScrollView
          ref={scrollRef}
          style={styles.logScroll}
          contentContainerStyle={styles.logContent}
          showsVerticalScrollIndicator={false}
        >
          {logs.map((entry, index) => (
            <LogItem key={entry.id} entry={entry} index={index} />
          ))}
        </ScrollView>
      </View>

      {/* ── Action Area ── */}
      <View style={styles.actionArea}>
        {!isOver ? (
          <NeonButton
            label={isFighting ? 'SALDIRIYOR...' : '⚔  SALDIR'}
            onPress={handleAttack}
            color={NEON_CYAN}
            disabled={isFighting}
            pulse={!isFighting}
          />
        ) : (
          <>
            <View style={[styles.resultBanner, { borderColor: isVictory ? NEON_GOLD : NEON_RED }]}>
              <Text style={[styles.resultText, { color: isVictory ? NEON_GOLD : NEON_RED }]}>
                {isVictory ? `🏆  +${GOLD_REWARD} ALTIN KAZANILDI` : '💀  KAHRAMANİN DÜŞTÜ'}
              </Text>
            </View>
            <NeonButton
              label="⟵  KÖYE DÖN"
              onPress={handleReturn}
              color={isVictory ? NEON_GOLD : NEON_RED}
              pulse
            />
          </>
        )}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_DEEP,
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Scan line
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: NEON_CYAN,
    opacity: 0.06,
    zIndex: 99,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerSub: {
    color: '#2a4060',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  headerStatus: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 4,
  },

  // HP Cards
  hpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  hpCard: {
    flex: 1,
    backgroundColor: BG_CARD,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  hpName: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 8,
    textAlign: 'center',
  },
  vsBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0d1e32',
    borderWidth: 1,
    borderColor: '#1e3050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    color: '#3a6080',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Log
  logContainer: {
    flex: 1,
    backgroundColor: BG_PANEL,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_DIM,
    overflow: 'hidden',
    marginBottom: 4,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_DIM,
    backgroundColor: BG_CARD,
  },
  logTitle: {
    color: '#4a6a8a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  logDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  logScroll: {
    flex: 1,
  },
  logContent: {
    padding: 12,
    paddingBottom: 20,
  },

  // Action
  actionArea: {
    paddingTop: 8,
  },
  resultBanner: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: BG_CARD,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
});

export default BattleScreen;