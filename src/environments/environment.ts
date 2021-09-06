// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useEmulator: true,
  functionsPrefix: 'api',
  firebase: {
    apiKey: "AIzaSyA4TcEwzyOT0B60mAGJjkjdQWDwCtLMgXs",
    authDomain: "softwareuno-pasti.firebaseapp.com",
    databaseURL: "https://softwareuno-pasti.firebaseio.com",
    projectId: "softwareuno-pasti",
    storageBucket: "softwareuno-pasti.appspot.com",
    messagingSenderId: "258448153207",
    appId: "1:258448153207:web:8aa636c62e8b1052990472"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
