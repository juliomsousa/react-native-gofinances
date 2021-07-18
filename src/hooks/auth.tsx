import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

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
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const AuthContext = createContext({} as IAuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userStorageLoading, setUserStorageLoading] = useState(true);
  const [user, setUser] = useState<User>({} as User);
  console.log({ CLIENT_ID, REDIRECT_URI });

  const userStorageKey = '@gofinances:user';

  const signInWithGoogle = async () => {
    try {
      // const url = AuthSession.makeRedirectUri({
      //   native: 'gofinances://',
      //   useProxy: true,
      // });
      // console.log('redirectUrl', url);

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
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      console.log('error', error);
      throw new Error(error);
    }
  };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = credential.fullName!.givenName!;

        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo: `https://ui-avatars.com/api/?name=${name}&length=1`,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  const signOut = async () => {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  };

  useEffect(() => {
    const loadUserStorageData = async () => {
      const userStoraged = await AsyncStorage.getItem(userStorageKey);

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }

      setUserStorageLoading(false);
    };

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithApple,
        signOut,
        userStorageLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
