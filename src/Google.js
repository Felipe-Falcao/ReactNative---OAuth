import React, { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { authorize, refresh, revoke, prefetchConfiguration } from 'react-native-app-auth';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import AuthContainer from './src/Auth'
import { GOOGLE_CLIENT_ID, FACE_CLIENT_ID } from '@env'

const configs = {
    google: {
        issuer: 'https://accounts.google.com',
        clientId: GOOGLE_CLIENT_ID + '.apps.googleusercontent.com',
        redirectUrl: 'com.rnauth:/oauth2redirect',
        scopes: ['openid', 'profile', 'email'],
    },
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