import { SportSlug } from './stake.types';

export interface SportBet {
  id: string;
  amount: number;
  currency: string;
  originalCurrency: string | null;
  eventName: string;
  sportSlug: SportSlug;
  potentialMultiplier: number;
  createdAt: string;
}
