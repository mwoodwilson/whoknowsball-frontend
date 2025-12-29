import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isAuthModalVisible: boolean;
  selectedSport: string | null;
  refreshing: boolean;
}

const initialState: UIState = {
  isAuthModalVisible: false,
  selectedSport: null,
  refreshing: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAuthModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalVisible = action.payload;
    },
    setSelectedSport: (state, action: PayloadAction<string>) => {
      state.selectedSport = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
  },
});

export const { setAuthModalVisible, setSelectedSport, setRefreshing } = uiSlice.actions;
export default uiSlice.reducer;
