import React, { useState } from 'react'
import { View } from 'react-native';
import { authorize } from 'react-native-app-auth';

// Log in to get an authentication token
// const authState = await authorize(config);

// // Refresh token
// const refreshedState = await refresh(config, {
//   refreshToken: authState.refreshToken
// });

// // Revoke token
// await revoke(config, {
//   tokenToRevoke: refreshedState.refreshToken
// });

export default (props) => {
    const [authState, setAuthState] = useState(null);

    const config = {
        issuer: 'https://accounts.google.com',
        clientId: 'GOOGLE_OAUTH_APP_GUID.apps.googleusercontent.com',
        redirectUrl: 'com.googleusercontent.apps.GOOGLE_OAUTH_APP_GUID:/oauth2redirect/google',
        scopes: ['openid', 'profile']
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {props.children}
        </View>
    )
}