import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { SportSlug } from '../../types/stake.types';
import { getSportBets } from '../../api/sportBets.api';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { sportsOptions, typeToLabel } from './constants';
import { getHighrollerSportBets } from '../../api/stake.api';

export interface SportBetsFilter {
  type: SportSlug | 'all';
  amount: number;
}

const minDistance = 0.01;

const SportBetsTable = () => {
  const [selectedTypes, setSelectedTypes] = useState<SportSlug[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [potentialMultiplierRange, setPotentialMultiplierRange] = useState([
    0, 10,
  ]);
  useQuery({
    queryFn: getHighrollerSportBets,
    refetchInterval: 10000,
  });

  const { data: sportBets } = useQuery({
    queryKey: ['sport-bets', selectedTypes],
    queryFn: () => getSportBets({ sportSlugs: selectedTypes }),
    refetchInterval: 10000,
  });

  const handleChange = (event: SelectChangeEvent<SportSlug[] | 'all'>) => {
    const value = event.target.value;
    if (value[value.length - 1] === 'all') {
      setSelectedTypes(
        selectedTypes.length === sportsOptions.length
          ? []
          : sportsOptions.map(({ value }) => value)
      );
      return;
    }

    setSelectedTypes(
      typeof value === 'string' ? (value.split(',') as SportSlug[]) : value
    );
  };

  const handleAmountInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmount(+event.target.value);
  };

  const handleChangePotentialMultiplierRange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPotentialMultiplierRange([
        Math.min(newValue[0], potentialMultiplierRange[1] - minDistance),
        potentialMultiplierRange[1],
      ]);
    } else {
      setPotentialMultiplierRange([
        potentialMultiplierRange[0],
        Math.max(newValue[1], potentialMultiplierRange[0] + minDistance),
      ]);
    }
  };

  return (
    <>
      <Stack m={6} gap={2}>
        <FormControl fullWidth>
          <InputLabel>Вид спорта</InputLabel>
          <Select
            value={selectedTypes}
            onChange={handleChange}
            multiple
            input={<OutlinedInput label="Вид спорта" />}
            renderValue={(selected) =>
              selected.map((value) => typeToLabel[value]).join(', ')
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: '300px',
                },
              },
            }}
          >
            <MenuItem value="all">
              <ListItemIcon>
                <Checkbox
                  checked={selectedTypes.length === sportsOptions.length}
                  indeterminate={
                    selectedTypes.length > 0 &&
                    selectedTypes.length < sportsOptions.length
                  }
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  selectedTypes.length === sportsOptions.length
                    ? 'Очистить все'
                    : 'Выбрать все'
                }
              />
            </MenuItem>
            {sportsOptions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                <Checkbox checked={selectedTypes.indexOf(value) > -1} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="outlined-number"
          label="Размер ставки от"
          type="number"
          value={amount}
          onChange={handleAmountInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Typography gutterBottom>Коэффициент</Typography>
        <Slider
          min={0.1}
          step={0.01}
          max={10}
          getAriaLabel={() => 'Коэффициент'}
          value={potentialMultiplierRange}
          onChange={handleChangePotentialMultiplierRange}
          valueLabelDisplay="auto"
          disableSwap
        />
      </Stack>
      <TableContainer
        component={Paper}
        sx={{
          margin: '48px',
          padding: '32px',
          width: 'auto',
          borderRadius: '10px',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Событие</TableCell>
              <TableCell align="right">Тип</TableCell>
              <TableCell align="right">Время</TableCell>
              <TableCell align="right">Коэффициенты</TableCell>
              <TableCell align="right">Сумма ставки</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(sportBets ?? [])
              .filter((bet) => bet.amount > amount)
              .filter(
                (bet) =>
                  potentialMultiplierRange[0] <= bet.potentialMultiplier &&
                  potentialMultiplierRange[1] >= bet.potentialMultiplier
              )
              .map((bet) => (
                <TableRow
                  key={bet.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {bet.eventName}
                  </TableCell>
                  <TableCell align="right">
                    {typeToLabel[bet.sportSlug]}
                  </TableCell>
                  <TableCell align="right">
                    {dayjs(bet.createdAt).format('HH:mm - DD MMMM YYYY')}
                  </TableCell>
                  <TableCell align="right">
                    {bet.potentialMultiplier.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <strong>{bet.amount.toFixed(2)}</strong>{' '}
                    {bet.currency.toUpperCase()} <br />{' '}
                    {bet.originalCurrency &&
                      `(converted from ${bet.originalCurrency})`}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SportBetsTable;
