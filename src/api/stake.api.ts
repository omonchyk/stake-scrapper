import axios from 'axios';
import { getSportBets, getSymbolsFromBets } from '../selectors/stake.selectors';
import { transformFromStakeBet } from '../transformers/sportBet.transformers';
import { HighrollerBetResponse } from '../types/stake.types';
import * as ExchangeApi from './exchange.api';
import * as SportBetsApi from './sportBets.api';

const highrollerSportBetsQuery =
  'query highrollerSportBets($limit: Int!) {\n  highrollerSportBets(limit: $limit) {\n    ...RealtimeSportBet\n  }\n}\n\nfragment RealtimeSportBet on Bet {\n  id\n  iid\n  bet {\n    __typename\n    ... on SwishBet {\n      ...SwishBetFragment\n    }\n    ... on SportBet {\n      id\n      outcomes {\n        id\n        fixture {\n          id\n          data {\n            __typename\n            ... on SportFixtureDataMatch {\n              competitors {\n                name\n                abbreviation\n              }\n            }\n          }\n          tournament {\n            id\n            category {\n              id\n              sport {\n                id\n                slug\n              }\n            }\n          }\n        }\n      }\n      createdAt\n      potentialMultiplier\n      amount\n      currency\n      user {\n        id\n        name\n      }\n    }\n  }\n}\n\nfragment SwishBetFragment on SwishBet {\n  __typename\n  active\n  amount\n  cashoutMultiplier\n  createdAt\n  currency\n  customBet\n  id\n  odds\n  payout\n  payoutMultiplier\n  updatedAt\n  status\n  user {\n    id\n    name\n  }\n  outcomes {\n    __typename\n    id\n    odds\n    lineType\n    outcome {\n      ...SwishMarketOutcomeFragment\n    }\n  }\n}\n\nfragment SwishMarketOutcomeFragment on SwishMarketOutcome {\n  __typename\n  id\n  line\n  over\n  under\n  gradeOver\n  gradeUnder\n  suspended\n  balanced\n  name\n  competitor {\n    id\n    name\n  }\n  market {\n    id\n    stat {\n      name\n      value\n    }\n    game {\n      id\n      fixture {\n        id\n        name\n        status\n        eventStatus {\n          ...SportFixtureEventStatus\n          ...EsportFixtureEventStatus\n        }\n        data {\n          ... on SportFixtureDataMatch {\n            __typename\n            startTime\n            competitors {\n              name\n              extId\n              countryCode\n              abbreviation\n            }\n          }\n        }\n        tournament {\n          id\n          category {\n            id\n            sport {\n              id\n              name\n              slug\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment SportFixtureEventStatus on SportFixtureEventStatusData {\n  homeScore\n  awayScore\n  matchStatus\n  clock {\n    matchTime\n    remainingTime\n  }\n  periodScores {\n    homeScore\n    awayScore\n    matchStatus\n  }\n  currentTeamServing\n  homeGameScore\n  awayGameScore\n  statistic {\n    yellowCards {\n      away\n      home\n    }\n    redCards {\n      away\n      home\n    }\n    corners {\n      home\n      away\n    }\n  }\n}\n\nfragment EsportFixtureEventStatus on EsportFixtureEventStatus {\n  matchStatus\n  homeScore\n  awayScore\n  scoreboard {\n    homeGold\n    awayGold\n    homeGoals\n    awayGoals\n    homeKills\n    awayKills\n    gameTime\n    homeDestroyedTowers\n    awayDestroyedTurrets\n    currentRound\n    currentCtTeam\n    currentDefTeam\n    time\n    awayWonRounds\n    homeWonRounds\n    remainingGameTime\n  }\n  periodScores {\n    type\n    number\n    awayGoals\n    awayKills\n    awayScore\n    homeGoals\n    homeKills\n    homeScore\n    awayWonRounds\n    homeWonRounds\n    matchStatus\n  }\n  __typename\n}\n';

const baseApiUrl = 'https://stake.com/_api/graphql';

export const getHighrollerSportBets = async () => {
  const { data } = await axios.request<HighrollerBetResponse>({
    method: 'post',
    url: baseApiUrl,
    headers: {
      authority: 'stake.com',
      accept: '*/*',
      'accept-language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
      'access-control-allow-origin': '*',
      'content-type': 'application/json',
      'x-language': 'en',
      'Access-Control-Allow-Origin': '*',
    },
    data: {
      query: highrollerSportBetsQuery,
      variables: {
        limit: 50,
      },
    },
  });

  const stakeBets = data.data.highrollerSportBets.map(({ bet }) => bet);
  const symbols = getSymbolsFromBets(stakeBets);
  const tickers = await ExchangeApi.getPriceBySymbols(symbols);
  const stakeSportBets = getSportBets(stakeBets);
  const sportBets = stakeSportBets.map((bet) =>
    transformFromStakeBet(bet, tickers)
  );
  await SportBetsApi.insertMultipleBets(sportBets);
  return sportBets;
};
