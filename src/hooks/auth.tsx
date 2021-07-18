import React, { createContext, ReactNode, useContext, useState } from 'react';
import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const AuthContext = createContext({} as IAuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);

  const signInWithGoogle = async () => {
    try {
      // const url = AuthSession.makeRedirectUri({
      //   native: 'gofinances://',
      //   useProxy: true,
      // });
      // console.log('redirectUrl', url);

      const CLIENT_ID =
        '1096312092549-g86p07uqit9nqbb5hvun86kt81cj41fj.apps.googleusercontent.com';
      const REDIRECT_URI = 'https://auth.expo.io/@jmasousa/gofinances';
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
        // returnUrl: Application.applicationId || '',
        // returnUrl: url,
        // showInRecents: true,
      })) as AuthorizationResponse;

      console.log({ type, params });

      if (type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        console.log('response', userInfo)

        setUser({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        });
      }
    } catch (error) {
      console.log('error', error);
      throw new Error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
