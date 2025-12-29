import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Bet {
  id: string;
  bks: number;
  status: 'PENDING' | 'ACTIVE' | 'SETTLED';
  stake: number;
  sportKey: string;
}

interface BetsState {
  activeBets: Bet[];
  settledBets: Bet[];
  loading: boolean;
}

const initialState: BetsState = {
  activeBets: [],
  settledBets: [],
  loading: false,
};

const betsSlice = createSlice({
  name: 'bets',
  initialState,
  reducers: {
    setBets: (state, action: PayloadAction<Partial<BetsState>>) => {
      return { ...state, ...action.payload };
    },
    addBet: (state, action: PayloadAction<Bet>) => {
      state.activeBets.push(action.payload);
    },
  },
});

export const { setBets, addBet } = betsSlice.actions;
export default betsSlice.reducer;
