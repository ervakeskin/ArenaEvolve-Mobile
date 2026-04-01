import { HeroStats } from '../types/game';

interface BattleTurnResult {
    damageDealt: number;
    isCritical: boolean;
    isDodge: boolean;
    logMessage: string;
}

export function calculateBattleTurn(
    playerHero: HeroStats,
    enemyHero: HeroStats,
    attackerName: string,
    defenderName: string
): BattleTurnResult {
    // Check for dodge (10% chance)
    const isDodge = Math.random() < 0.1;
    if (isDodge) {
        return {
            damageDealt: 0,
            isCritical: false,
            isDodge: true,
            logMessage: `${defenderName} dodged the attack!`,
        };
    }

    // Calculate base damage
    const baseDamage = Math.round(
        playerHero.atkPhysical - enemyHero.def / 2 + playerHero.atkMagic
    );

    // Check for critical hit (15% chance)
    const isCritical = Math.random() < 0.15;
    const damageDealt = isCritical ? Math.round(baseDamage * 2) : baseDamage;

    const criticalText = isCritical ? 'critical ' : '';
    const logMessage = `${attackerName} dealt ${damageDealt} ${criticalText}damage!`;

    return {
        damageDealt: Math.max(0, damageDealt),
        isCritical,
        isDodge: false,
        logMessage,
    };
}