import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  sportKey: string;
  commenceTime: string;
  odds: any;
}

interface GamesState {
  todayGames: Game[];
  liveGames: Game[];
  loading: boolean;
}

const initialState: GamesState = {
  todayGames: [],
  liveGames: [],
  loading: false,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<Partial<GamesState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setGames } = gamesSlice.actions;
export default gamesSlice.reducer;
