import { binance } from 'ccxt';

const exchange = new binance();

export const getPriceBySymbols = async (symbols: string[]) => {
  return await exchange.fetchTickers(symbols);
};
