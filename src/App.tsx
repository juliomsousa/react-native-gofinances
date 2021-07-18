import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import { Routes } from './routes';
import { AuthProvider, useAuth } from './hooks/auth';
import theme from './globals/styles/theme';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const { userStorageLoading } = useAuth();

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor={'transparent'}
      />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
