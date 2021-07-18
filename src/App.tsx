import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './routes/app.routes';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './hooks/auth';
import theme from './globals/styles/theme';

import { SignIn } from './screens/SignIn';

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

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor={'transparent'}
        />
        <AuthProvider>
          <SignIn />
        </AuthProvider>
        {/* <AppRoutes /> */}
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
