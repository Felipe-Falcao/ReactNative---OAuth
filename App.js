import React, { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { authorize, refresh, revoke, prefetchConfiguration } from 'react-native-app-auth';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import AuthContainer from './src/Auth'
import { CLIENT_ID } from '@env'

// const configs = {
//   google: {
//     issuer: 'https://accounts.google.com',
//     clientId: '700126173685-ri2hce8g5031m4hdfrhl2uq4blb8sctj.apps.googleusercontent.com',
//     redirectUrl: 'com.googleusercontent.apps.700126173685-ri2hce8g5031m4hdfrhl2uq4blb8sctj:/oauth2redirect/google',
//     scopes: ['openid', 'profile'],
//     // warmAndPrefetchChrome: true,
//   }
// };

const configs = {
  identityserver: {
    issuer: 'https://demo.identityserver.io',
    clientId: 'interactive.public',
    redirectUrl: 'io.identityserver.demo:/oauthredirect',
    additionalParameters: {},
    scopes: ['openid', 'profile', 'email', 'offline_access'],

    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
    //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
    //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
    // }
  },
  auth0: {
    // From https://openidconnect.net/
    issuer: 'https://samples.auth0.com',
    clientId: 'kbyuFDidLLm280LIwVFiazOqjO3ty8KH',
    redirectUrl: 'https://openidconnect.net/callback',
    additionalParameters: {},
    scopes: ['openid', 'profile', 'email', 'phone', 'address'],

    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://samples.auth0.com/authorize',
    //   tokenEndpoint: 'https://samples.auth0.com/oauth/token',
    //   revocationEndpoint: 'https://samples.auth0.com/oauth/revoke'
    // }
  },
  google: {
    issuer: 'https://accounts.google.com',
    clientId: CLIENT_ID + '.apps.googleusercontent.com',
    // redirectUrl: 'com.googleusercontent.apps.700126173685-ri2hce8g5031m4hdfrhl2uq4blb8sctj:/oauth2redirect/google',
    // redirectUrl: 'urn:ietf:wg:oauth:2.0:oob',
    redirectUrl: 'com.rnauth:/oauth2redirect',
    scopes: ['openid', 'profile', 'email'],
    // warmAndPrefetchChrome: true,
    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
    //   tokenEndpoint: 'https://oauth2.googleapis.com/token',
    //   revocationEndpoint: 'https://www.googleapis.com/oauth2/v1/certs'
    // }
  }
};


const defaultAuthState = {
  hasLoggedInOnce: false,
  provider: '',
  accessToken: '',
  accessTokenExpirationDate: '',
  refreshToken: ''
};

const App = () => {
  const [authState, setAuthState] = useState(defaultAuthState);

  React.useEffect(() => {
    prefetchConfiguration({
      warmAndPrefetchChrome: true,
      ...configs.identityserver
    });
  }, []);

  const handleAuthorize = useCallback(
    async provider => {
      try {
        const config = configs[provider];
        const newAuthState = await authorize(config);

        setAuthState({
          hasLoggedInOnce: true,
          provider: provider,
          ...newAuthState
        });
      } catch (error) {
        Alert.alert('Falha ao realizar o Login', error.message);
      }
    },
    [authState]
  );

  const handleRefresh = useCallback(async () => {
    try {
      const config = configs[authState.provider];
      const newAuthState = await refresh(config, {
        refreshToken: authState.refreshToken
      });

      setAuthState(current => ({
        ...current,
        ...newAuthState,
        refreshToken: newAuthState.refreshToken || current.refreshToken
      }))

    } catch (error) {
      Alert.alert('Failed to refresh token', error.message);
    }
  }, [authState]);

  const handleRevoke = useCallback(async () => {
    try {
      const config = configs[authState.provider];
      await revoke(config, {
        tokenToRevoke: authState.accessToken,
        sendClientId: true
      });

      setAuthState({
        provider: '',
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: ''
      });
    } catch (error) {
      Alert.alert('Failed to revoke token', error.message);
    }
  }, [authState]);

  const showRevoke = useMemo(() => {
    if (authState.accessToken) {
      const config = configs[authState.provider];
      if (config.issuer || config.serviceConfiguration.revocationEndpoint) {
        return true;
      }
    }
    return false;
  }, [authState]);

  return (
    <AuthContainer>
      {!!authState.accessToken ? (
        <View>
          <Text style={{ backgroundColor: '#CECECE' }}>accessToken</Text>
          <Text>{authState.accessToken}</Text>
          <Text style={{ backgroundColor: '#CECECE' }}>accessTokenExpirationDate</Text>
          <Text>{authState.accessTokenExpirationDate}</Text>
          <Text style={{ backgroundColor: '#CECECE' }}>refreshToken</Text>
          <Text>{authState.refreshToken}</Text>
          <Text style={{ backgroundColor: '#CECECE' }}>scopes</Text>
          <Text>{authState.scopes.join(', ')}</Text>
        </View>
      ) : (
        <Text>{authState.hasLoggedInOnce ? 'Goodbye.' : 'Hello, stranger.'}</Text>
      )}

      <View>
        {!authState.accessToken ? (
          <>
            <TouchableOpacity
              style={{ backgroundColor: '#CECECE', padding: 10, alignItems: 'center', margin: 10 }}
              onPress={() => handleAuthorize('identityserver')}
            >
              <Text>Authorize IdentityServer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#CECECE', padding: 10, alignItems: 'center', margin: 10 }}
              onPress={() => handleAuthorize('auth0')}
            >
              <Text>Authorize Auth0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'green', padding: 10, alignItems: 'center', margin: 10 }}
              onPress={() => handleAuthorize('google')}
            >
              <Text style={{ color: 'white' }}>Google</Text>
            </TouchableOpacity>
          </>
        ) : null}
        {!!authState.refreshToken ? (
          <TouchableOpacity
            style={{ backgroundColor: '#CECECE', padding: 10, alignItems: 'center', margin: 10 }}
            onPress={handleRefresh}
          >
            <Text>Refresh</Text>
          </TouchableOpacity>
        ) : null}
        {showRevoke ? (
          <TouchableOpacity
            style={{ backgroundColor: '#CECECE', padding: 10, alignItems: 'center', margin: 10 }}
            onPress={handleRevoke}
          >
            <Text>Revoke</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </AuthContainer>
  );
}

export default App;