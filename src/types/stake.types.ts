export type SportSlug =
  | 'table-tennis'
  | 'tennis'
  | 'soccer'
  | 'cricket'
  | 'league-of-legends'
  | 'baseball'
  | 'mma'
  | 'counter-strike'
  | 'basketball'
  | 'kings-of-glory'
  | 'badminton'
  | 'dota-2'
  | 'nba2k'
  | 'formula-1';

export interface Sport {
  id: string;
  slug: SportSlug;
}

export interface Category {
  id: string;
  sport: Sport;
}

export interface Tournament {
  id: string;
  category: Category;
}

export interface Competitor {
  abbreviation: string;
  name: string;
}

export interface Fixture {
  id: string;
  data: {
    competitors: Competitor[];
  };
  tournament: Tournament;
}

export interface Outcome {
  id: string;
  fixture: Fixture;
}

type Typename = 'SportBet' | 'SwishBet';

export interface Bet {
  id: string;
  amount: number;
  currency: string;
  potentialMultiplier: number;
  outcomes: Outcome[];
  createdAt: string;
  __typename: Typename;
}

export interface HighrollerBetResponse {
  data: {
    highrollerSportBets: {
      id: string;
      iid: string;
      bet: Bet;
    }[];
  };
}
