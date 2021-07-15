import React from 'react';
import { Dashboard } from './screens/Dashboard';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import theme from './globals/styles/theme';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Register } from './screens/Register';
import { CategorySelect } from './screens/CategorySelect';

const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Register />
      {/* <Dashboard /> */}
      {/* <CategorySelect /> */}
    </ThemeProvider>
  );
};

export default App;
