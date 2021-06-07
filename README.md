# # ReactNative---OAuth
## 1. Google: Setting up Android
### 1.1 Features

- Configure a project on [Google Cloud Platform][gcloud] and configure a new credential to Android
- Create a react-native project or join an existing one
- Configure the callback

### 1.2 Configuring a project

- Create a project or join an existing one
- Credentials > Create Credentials
  - AppType: ```Android```
  - You can find package name within the  ```/android/app/src/main/AndroidManifest.xml``` of your project.
  - For the SHA-1 signing certificate, tap from the root of your project ```keytool -keystore ./android/app/debug.keystore -list -v```. You can find the password in your ```app/build.gradle```. By default the password is ```android```.
  - You can also find your SHA-1 certiticate on ```/android```, tapping ```gradlew signingReport```.
  - If you still having trouble, see ```https://www.youtube.com/watch?v=0FTxFr5I2rs``` and create your own key.
    - Create: ```keytool -genkey -v -keystore mykeystore.keystore -alias mykeyalias -keyalg RSA -keysize 2048 -validity 100000 ```
    - See: ```keytool -keystore ./android/app/mykeystore.keystore -list -v -alias mykeyalias```

- Create and copy the ClientID.

### 1.3 Create a react-native project or join an existing one

- Getting Started: ```npm install react-native-app-auth --save```
- To capture the [authorization redirect][redirect], add the following property to the defaultConfig in android/app/build.gradle:
```
android {
  defaultConfig {
    manifestPlaceholders = [
      appAuthRedirectScheme: '<PACKAGE_NAME>'
    ]
  }
}
```

### 1.4 Configure the callback
- Base config to Google
```
const config = {
  issuer: 'https://accounts.google.com',
  clientId: '<YOUR_CLIENT_ID>.apps.googleusercontent.com',
  redirectUrl: '<PACKAGE_NAME>:/oauth2redirect',
  scopes: ['openid', 'profile', 'email'],
};
```
- See an [example]

## 2. Facebook: Setting up Android
keytool -exportcert -alias androiddebugkey -keystore ./android/app/debug.keystore | openssl sha1 -binary | openssl base64
https://code.google.com/archive/p/openssl-for-windows/downloads
keytool -exportcert -alias androiddebugkey -keystore ./android/app/debug.keystore | "C:\openssl\bin\openssl.exe" sha1 -binary | "C:\openssl\bin\openssl.exe" base64


Salve as alterações. Caso apareça um alerta sobre o nome do pacote escolha a opção Usar este nome de pacote. Esse alerta aparece quando seu aplicativo ainda não está disponível no Google Play.

## 3. Support: 
### Google
- https://chaim-zalmy-muskal.medium.com/hi-6d328bbd550f
- https://github.com/FormidableLabs/react-native-app-auth
- https://developers.google.com/android/guides/client-auth?authuser=1#using_gradles_signing_report

### Facebook
- https://developers.facebook.com/docs/android/getting-started/
- https://medium.com/reactbrasil/instalando-o-react-native-fbsdk-do-jeito-certo-9f0fada5be4
- https://www.npmjs.com/package/react-native-fbsdk-next

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
    
   [gcloud]: <https://console.cloud.google.com/apis/credentials>
   [redirect]: <https://github.com/openid/AppAuth-android#capturing-the-authorization-redirect>
   [example]: <https://github.com/FormidableLabs/react-native-app-auth/tree/main/Example>
