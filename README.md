# # ReactNative---OAuth
## 1. Google: Setting up Android
### 1.1 Step by step

- Used package [react-native-app-auth][packageGoogle]
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

### 2.1 Step by step

- Used package [react-native-fbsdk-next][package]
- Create a new App on [Facebook for Developers][facedev] and configure a new credential to Android
- Configure a react-native project or join an existing one
- Put some code

### 2.2 Configuring a new App

- Go to [Facebook for Developers][facedev]
- Create a new App ```Consumer > App_name > Create App```
- Add a platform at ```Configurations > Basic > Add Platform```
  - Select ```Android```.
  - Put the package name found at ```/android/app/src/main/AndroidManifest.xml``` path in your project.
  - Put your app Hash Key
    - To generate this key, at the project source path type the command ```keytool -keystore ./android/app/debug.keystore -exportcert -alias androiddebugkey | openssl sha1 -binary | openssl base64```
    - Probably you will have some throuble with openssl
    - To fix it, download and extract [OpenSSL for Windows][openssl] and run ```keytool -exportcert -alias androiddebugkey -keystore ./android/app/debug.keystore | "<PATH>\openssl\bin\openssl.exe" sha1 -binary | "<PATH>\openssl\bin\openssl.exe" base64```
  - Change ```Single Login``` to YES, the rest NO.
  - Save Changes. If an alert about the package name appears, choose the option ```Use this package name```. This alert appears when your app is not yet available on Google Play.

### 2.3 Configure a react-native project or join an existing one

- At your React Native Project
- Make sure you set up a Facebook app and updated the ```AndroidManifest.xml``` and ```strings.xml``` with Facebook app settings.
  - At ```android/app/src/main/AndroidManifest.xml```
    - Add ```<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>``` under ```<activity>``` tag.
    - Make sure that you have the follow permission ```<uses-permission android:name="android.permission.INTERNET" />```.
  - At ```android/app/src/main/res/values/strings.xml```
    - Add ```<string name="facebook_app_id">FACEBOOK_APP_ID</string>```.

### 2.4 Put some code

- See [React-Native FBSDK-NEXT package][package] and follow the code steps.

## 3. Support: 
### Google
- https://chaim-zalmy-muskal.medium.com/hi-6d328bbd550f
- https://github.com/FormidableLabs/react-native-app-auth
- https://developers.google.com/android/guides/client-auth?authuser=1#using_gradles_signing_report

### Facebook
- https://developers.facebook.com/docs/android/getting-started/
- How to configure on Facebook Developer: ```https://medium.com/reactbrasil/instalando-o-react-native-fbsdk-do-jeito-certo-9f0fada5be4```
- Package to use: ```https://www.npmjs.com/package/react-native-fbsdk-next```

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
    
   [gcloud]: <https://console.cloud.google.com/apis/credentials>
   [redirect]: <https://github.com/openid/AppAuth-android#capturing-the-authorization-redirect>
   [example]: <https://github.com/FormidableLabs/react-native-app-auth/tree/main/Example>
   [facedev]: <https://developers.facebook.com/>
   [openssl]: <https://code.google.com/archive/p/openssl-for-windows/downloads>
   [package]: <https://www.npmjs.com/package/react-native-fbsdk-next>
   [packageGoogle]: <https://github.com/FormidableLabs/react-native-app-auth>
