/* global localStorage $ auth0 location */
var AUTH0_CLIENT_ID = 'yeJIohNks41mYAiaID29JoxsZESOpEQ8';
var AUTH0_DOMAIN = 'chektdev.auth0.com';
var AUTH0_CALLBACK_URL = location.href;

$('document').ready(function () {
  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    // scope: 'openid profile email',
    scope: 'openid email',
    leeway: 10
  });

  // buttons and event listeners
  var loginBtn = $('#qsLoginBtn');
  var logoutBtn = $('#qsLogoutBtn');
  var cardPage = $('.card');

  loginBtn.click(function (e) {
    e.preventDefault();
    webAuth.authorize();
  });

  logoutBtn.click(logout);
  cardPage.click(goDocPage);

  function setSession (authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('doc_access_token', authResult.accessToken);
    localStorage.setItem('doc_id_token', authResult.idToken);
    localStorage.setItem('doc_expires_at', expiresAt);
  }

  function logout () {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('doc_access_token');
    localStorage.removeItem('doc_id_token');
    localStorage.removeItem('doc_expires_at');
    webAuth.logout({ returnTo: AUTH0_CALLBACK_URL });
    // webAuth.logout();
    displayButtons();
  }

  function isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('doc_expires_at'));
    if (expiresAt === null) {
      return false;
    }
    return new Date().getTime() < expiresAt;
  }

  function handleAuthentication () {
    webAuth.parseHash(function (err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        loginBtn.css('display', 'none');
      } else if (err) {
        console.log(err);
        // alert('Error: ' + err.error + '. Check the console for further details.');
      }
      displayButtons();
    });
  }

  function displayButtons () {
    if (isAuthenticated()) {
      loginBtn.css('display', 'none');
      logoutBtn.css('display', 'inline-block');
    } else {
      loginBtn.css('display', 'inline-block');
      logoutBtn.css('display', 'none');
    }
  }

  function goDocPage () {
    if (isAuthenticated()) {
      if (this.dataset.url) {
        window.location.href = this.dataset.url;
      }
    } else {
      webAuth.authorize();
    }
  }

  handleAuthentication();
});
