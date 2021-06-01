
import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { authorize } from 'react-native-app-auth';
import AuthProvider from './src/Auth.js'

const config = {
  issuer: 'https://accounts.google.com',
  clientId: '83849151947-lla6l5mrep1fsn0bpj8gvo098e4t6ldt.apps.googleusercontent.com',
  // clientSecret: 'Authentication:Google:ClientSecret" "M_GnWZ1VrBtP7KQXrmwk-xHu',
  redirectUrl: 'com.googleusercontent.apps.83849151947-lla6l5mrep1fsn0bpj8gvo098e4t6ldt:/oauth2redirect/google',
  scopes: ['openid', 'profile']
};

export default class App extends Component {
  state = {
    token: ''
  }

  getGoogle = async () => {
    const authState = await authorize(config)
    // console.log(authState)
  }

  render() {
    return (
      <AuthProvider>
        <TouchableOpacity onPress={this.getGoogle}>
          <Text>Google</Text>
        </TouchableOpacity>
      </AuthProvider>
    );
  }
}