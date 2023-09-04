import { SportSlug } from '../../types/stake.types';

export const typeToLabel: Record<SportSlug, string> = {
  'table-tennis': 'Настольный теннис',
  cricket: 'Крикет',
  soccer: 'Футбол',
  tennis: 'Теннис',
  'league-of-legends': 'League Of Legends',
  baseball: 'Бейсбол',
  mma: 'MMA',
  basketball: 'Баскетбол',
  'counter-strike': 'Counter Strike',
  'kings-of-glory': 'Kings Of Glory',
  badminton: 'Бадминтон',
  'dota-2': 'Dota 2',
  nba2k: 'NBA 2K',
  'formula-1': 'Formula 1',
};

interface MenuOption {
  label: string;
  value: SportSlug;
}

export const sportsOptions: MenuOption[] = [...Object.entries(typeToLabel)
  .map(([value, label]) => ({
    label,
    value: value as SportSlug,
  }))]
