import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import betsReducer from './slices/betsSlice';
import gamesReducer from './slices/gamesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    bets: betsReducer,
    games: gamesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
