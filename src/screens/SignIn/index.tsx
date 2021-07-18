import React from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import * as WebBrowser from 'expo-web-browser';

import { SignInSocialButton } from '../../components/SignInSocialButton';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

export const SignIn = () => {
  const { signInWithGoogle } = useAuth();

  React.useEffect(() => {
    WebBrowser.warmUpAsync();
    
    return () => {
      WebBrowser.coolDownAsync();
      };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar com a conta Google');
    }
  };

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>{'Controle suas \nfinanças de forma \nmuito simples'}</Title>
        </TitleWrapper>

        <SignInTitle>
          {'Faça seu login com \numa das contas abaixo'}
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
};
