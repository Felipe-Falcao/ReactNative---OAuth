import React, { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { authorize, refresh, revoke, prefetchConfiguration } from 'react-native-app-auth';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import AuthContainer from './src/Auth'
import { GOOGLE_CLIENT_ID } from '@env'
import { Profile, LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk-next';
import axios from 'axios'

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
    clientId: GOOGLE_CLIENT_ID + '.apps.googleusercontent.com',
    // redirectUrl: 'com.googleusercontent.apps.700126173685-ri2hce8g5031m4hdfrhl2uq4blb8sctj:/oauth2redirect/google',
    // redirectUrl: 'urn:ietf:wg:oauth:2.0:oob',
    redirectUrl: 'com.rnauth:/oauth2redirect',
    scopes: ['openid', 'profile', 'email'],
    // warmAndPrefetchChrome: true,
    serviceConfiguration: {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://www.googleapis.com/oauth2/v1/certs'
    }
  },
  //https://www.googleapis.com/oauth2/v1/userinfo?access_token=
  facebook: {
    issuer: 'https://www.facebook.com/v3.1/dialog/oauth/cliend_id',
    clientId: '587286728918071',
    redirectUrl: 'com.rnauth:/oauth2redirect',
    scopes: ['email'],
  }
};


const defaultAuthState = {
  hasLoggedInOnce: false,
  provider: '',
  accessToken: '',
  accessTokenExpirationDate: '',
  refreshToken: '',
  scopes: '',
};

const defaultUserInfo = {
  userEmail: '',
  userName: '',
  userPicture: '',
  userId: '',
}

const App = () => {
  const [authState, setAuthState] = useState(defaultAuthState)
  const [userInfo, setUserInfo] = useState(defaultUserInfo)

  function getUser() {
    axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token: authState.accessToken
      }
    })
      .then(function (response) {
        setUserInfo({
          userEmail: response.data.email,
          userName: response.data.name,
          userPicture: response.data.picture,
          userId: response.data.id,
        })
        console.log(response)
      })
      .catch(function (error) {
        // console.log(error);
        null
      });
  }

  React.useEffect(() => {
    prefetchConfiguration({
      warmAndPrefetchChrome: true,
      ...configs.identityserver
    });
  }, []);

  async function getFacebookUser() {
    const currentProfile = await Profile.getCurrentProfile()
    setUserInfo({
      userEmail: currentProfile.userID,
      userName: currentProfile.name,
      userPicture: currentProfile.imageURL,
      userId: currentProfile.userID,
    })
    if (currentProfile) {
      console.log(currentProfile)
    }
  }

  const handleFacebookSignin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile'])
      const accessToken = await AccessToken.getCurrentAccessToken()
      console.log(accessToken)
      if (result.isCancelled) {
        console.log('Login Cancelado')
      } else {
        setAuthState(current => ({
          ...current,
          // provider: accessToken.accessTokenSource,
          provider: 'facebook',
          scopes: accessToken.permissions,
          accessToken: accessToken.accessToken,
          accessTokenExpirationDate: accessToken.dataAccessExpirationTime,
        }))
        getFacebookUser()
      }
    } catch (error) {
      console.log(error)
    }

    // LoginManager.logInWithPermissions(["public_profile"]).then(
    //   function (result) {
    //     if (result.isCancelled) {
    //       console.log("Login cancelled");
    //     } else {
    //       Profile.getCurrentProfile().then(
    //         function (currentProfile) {
    //           if (currentProfile) {
    //             console.log("The current logged user is: " +
    //               currentProfile.name
    //               + ". His profile id is: " +
    //               currentProfile.userID
    //             );
    //             console.log(currentProfile)
    //           }
    //         }
    //       )
    //       AccessToken.getCurrentAccessToken().then(
    //         (data) => {
    //           console.log(data.accessToken.toString())
    //         }
    //       )
    //       // console.log(
    //       //   "Login success with permissions: " +
    //       //   result.grantedPermissions.toString()
    //       // );
    //     }
    //   },
    //   function (error) {
    //     console.log("Login fail with error: " + error);
    //   }
    // );
  }

  const handleAuthorize = useCallback(
    async provider => {
      try {
        const config = configs[provider];
        const newAuthState = await authorize(config);

        setAuthState({
          hasLoggedInOnce: true,
          provider: provider,
          ...newAuthState
        })

      } catch (error) {
        console.log(error)
        Alert.alert('Falha ao realizar o Login', error.message);
      }
    },
    [authState], userInfo.userEmail == '' ? getUser() : false
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
      if (authState.provider == 'google') {
        const config = configs[authState.provider];
        await revoke(config, {
          tokenToRevoke: authState.accessToken,
          sendClientId: true
        });
      }

      setAuthState({
        ...defaultAuthState,
      });

      setUserInfo({ ...defaultUserInfo })
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
          {authState.scopes.map((s, index) => (<Text key={index}>{s}</Text>))}
          <Text style={{ backgroundColor: '#CECECE' }}>UserInfo</Text>
          <Text>{userInfo.userName}</Text>
          <Text>{userInfo.userEmail}</Text>
          <Text>{userInfo.userPicture}</Text>
          <Text>{userInfo.userId}</Text>
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
              onPress={() => { handleAuthorize('google') }}
            >
              <Text style={{ color: 'white' }}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', margin: 10 }}
              onPress={() => { handleFacebookSignin() }}
            >
              <Text style={{ color: 'white' }}>Facebook</Text>
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
        {/* <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data.accessToken.toString() + '\n')
                  }
                )

                const currentProfile = Profile.getCurrentProfile().then(
                  function (currentProfile) {
                    if (currentProfile) {
                      console.log("The current logged user is: " +
                        currentProfile.name
                        + ". His profile id is: " +
                        currentProfile.userID
                      );
                    }
                  }
                );
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")} /> */}
      </View>
    </AuthContainer>
  );
}

export default App;