import { useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setTheme, setThemeMode, setAccentColor, ThemeState } from '../store/themeSlice';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const systemColorScheme = useColorScheme(); // 'light' or 'dark'
  const { mode, accentColor } = useSelector((state: RootState) => state.theme);

  // Load theme from AsyncStorage on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          const parsedTheme: ThemeState = JSON.parse(savedTheme);
          dispatch(setTheme(parsedTheme));
        } else {
          // If no saved theme, set initial mode based on system preference
          dispatch(setThemeMode(systemColorScheme || 'dark'));
        }
      } catch (error) {
        console.error('Failed to load theme from AsyncStorage', error);
        // Fallback to system color scheme if loading fails
        dispatch(setThemeMode(systemColorScheme || 'dark'));
      }
    };
    loadTheme();
  }, [dispatch, systemColorScheme]);

  // Save theme to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('appTheme', JSON.stringify({ mode, accentColor }));
      } catch (error) {
        console.error('Failed to save theme to AsyncStorage', error);
      }
    };
    saveTheme();
  }, [mode, accentColor]);

  const isDarkMode = mode === 'dark' || (mode === 'custom' && accentColor === '#000000'); // Consider black accent as dark
  const isLightMode = mode === 'light';

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    card: isDarkMode ? '#1E1E1E' : '#F6F6F6',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    subText: isDarkMode ? '#B3B3B3' : '#535353',
    primary: accentColor,
    secondary: isDarkMode ? '#282828' : '#E0E0E0',
    error: '#f44336',
  };

  const toggleThemeMode = (newMode: 'light' | 'dark') => {
    dispatch(setThemeMode(newMode));
  };

  const setCustomAccentColor = (color: string) => {
    dispatch(setAccentColor(color));
  };

  return {
    mode,
    accentColor,
    colors,
    isDarkMode,
    isLightMode,
    toggleThemeMode,
    setCustomAccentColor,
  };
};
