import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeState = {
  mode: 'light' | 'dark' | 'custom';
  accentColor: string;
};

const initialState: ThemeState = {
  mode: 'dark', // Default theme
  accentColor: '#1DB954', // Spotify green
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'custom'>) => {
      state.mode = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
      state.mode = 'custom'; // When accent color is set, switch to custom mode
    },
    setTheme: (state, action: PayloadAction<ThemeState>) => {
      state.mode = action.payload.mode;
      state.accentColor = action.payload.accentColor;
    },
  },
});

export const { setThemeMode, setAccentColor, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
