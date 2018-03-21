// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  networkURL: 'http://127.0.0.1:7545',
  gasLimit : 4300000
  
};

export const firebaseconfig=  
{  
  apiKey: "YOUR API KEY",
  authDomain: "something.firebaseapp.com",
  databaseURL: "https://something.firebaseio.com",
  projectId: "yourproject id",
  storageBucket: "yourBucket.appspot.com",
  messagingSenderId: "some number"
}   


