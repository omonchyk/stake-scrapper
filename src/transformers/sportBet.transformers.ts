import { Dictionary, Ticker } from 'ccxt';
import { getEventName, getSportSlug, getSymbolFromBet } from '../selectors/stake.selectors';
import { SportBet } from '../types/sportBet.types';
import { Bet } from '../types/stake.types';

const fiatCurrencies = new Set(['cad', 'usd', 'usdt', 'usdc', 'brl', 'jpy', 'irl']);

export const transformFromStakeBet = (stakeBet: Bet, exchangeTicker: Dictionary<Ticker>): SportBet => {
  const isFiatCurrency = fiatCurrencies.has(stakeBet.currency);
  const symbol = getSymbolFromBet(stakeBet);
  console.log('exchangeTicker', exchangeTicker);
  const amount = isFiatCurrency ? stakeBet.amount : stakeBet.amount * (exchangeTicker[symbol].last ?? exchangeTicker[symbol].high);
  const currency = isFiatCurrency ? stakeBet.currency.toUpperCase() : 'USDT';
  const originalCurrency = isFiatCurrency ? null : stakeBet.currency.toUpperCase();
  const eventName = getEventName(stakeBet.outcomes);
  const sportSlug = getSportSlug(stakeBet);
  
  return {
    id: stakeBet.id,
    amount,
    currency,
    originalCurrency,
    eventName,
    sportSlug,
    potentialMultiplier: stakeBet.potentialMultiplier,
    createdAt: stakeBet.createdAt,
  };
};
