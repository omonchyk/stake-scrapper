import { Bet, Outcome, SportSlug } from '../types/stake.types';

const symbolsToIgnore = new Set(['USDC/USDT', 'USDT/USDT', 'CAD/USDT', 'BRL/USDT', 'JPY/USDT', 'INR/USDT']);

export const getSymbolFromBet = (bet: Bet): string => {
  return `${bet.currency.toUpperCase()}/USDT`;
};

export const getSymbolsFromBets = (bets: Bet[]): string[] => {
  return Array.from(
    new Set(bets.map((bet) => `${bet.currency.toUpperCase()}/USDT`))
  ).filter((symbol) => !symbolsToIgnore.has(symbol));
};

export const getSportBets = (bets?: Bet[]): Bet[] => {
  if (!bets) return [];
  return bets.filter((bet) => bet.__typename === 'SportBet');
};

export const getEventName = (outcomes: Outcome[]): string => {
  if (outcomes.length > 1) {
    return `Экспресс (${outcomes.length})`;
  }
  if (!outcomes[0].fixture) return 'Неизвестно';
  const competitorNames = outcomes[0].fixture?.data?.competitors?.map(
    ({ name }) => name
  );
  return !!competitorNames ? competitorNames.join(' - ') : 'Неизвестно';
};

export const getSportSlug = (bet: Bet): SportSlug => {
  return bet.outcomes[0].fixture.tournament.category.sport.slug;
};
