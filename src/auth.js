import auth0 from 'auth0-js';
import AWS from 'aws-sdk';
import { AUTH_CONFIG } from './auth0-variables';

class Auth0Auth {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid'
  });

  constructor(store) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.store = store;
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.store.dispatch({type: 'CREDS', credentials: authResult});
        window.location.hash = '';
      } else if (err) {
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    localStorage.setItem('isLoggedIn', 'true');
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  logout() {
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    localStorage.removeItem('isLoggedIn');
    this.auth0.logout({returnTo: window.location.href});
  }

  isAuthenticated() {
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }

}

class AWSAuth {
  constructor(store) {
    this.store = store
  }

  login(idToken) {
    AWS.config.region = AUTH_CONFIG.region;
    AWS.config.store = this.store;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AUTH_CONFIG.identityPoolId,
      Logins: { [AUTH_CONFIG.domain]: idToken}
    });
    AWS.config.credentials.get(function() {
      let creds = {
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
        identityId: AWS.config.credentials.identityId
      }
      AWS.config.store.dispatch({type: 'AWS_CREDS', awsCredentials: creds});
    })
  }

  logout() {
  }

  static middleware() {
    return next => action => {
      return next(action)
    }
  }
}

export { Auth0Auth, AWSAuth }
