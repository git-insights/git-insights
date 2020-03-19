const OAuth2Strategy = require('passport-oauth2');
const InternalOAuthError = require('passport-oauth2').InternalOAuthError;
const { parseUser, parseEmails } = require('./profile');

class Strategy extends OAuth2Strategy {
  constructor(_options, _verify) {
    let options = _options || {};
    let verify = _verify;

    options.authorizationURL = options.authorizationURL || 'https://github.com/login/oauth/authorize';
    options.tokenURL = options.tokenURL || 'https://github.com/login/oauth/access_token';

    super(options, verify);

    this.name = 'github';

    this._verificationCodeField = options._verificationCodeField || 'verification_code';
    // this._accessTokenField = options.accessTokenField || 'access_token';
    // this._refreshTokenField = options.refreshTokenField || 'refresh_token';
    this._profileURL = options.profileURL || 'https://api.github.com/user';
    this._passReqToCallback = options.passReqToCallback;
  }

  /**
   * Parse user profile
   * @param {String} accessToken GitHub OAuth2 access token
   * @param {Function} done
   */
  userProfile(accessToken, done) {
    console.log(accessToken);
    this._oauth2.get(this._profileURL, accessToken, (error, body, res) => {
      if (error) {
        try {
          let errorJSON = JSON.parse(error.data);
          return done(new InternalOAuthError(errorJSON.message, error.statusCode));
        } catch (_) {
          return done(new InternalOAuthError('Failed to fetch user profile', error));
        }
      }

      let profile = {};

      try {
        profile = parseUser(body);
      } catch (e) {
        return done(e);
      }

      this._oauth2._request('GET', this._profileURL + '/emails', { 'Accept': 'application/vnd.github.v3+json' }, '', accessToken, function (error, body, res) {
        if (error) return done(null, profile);

        let json;
        try {
          json = JSON.parse(body);
        } catch (_) {
          return done(null, profile);
        }

        if (!json.length) return done(null, profile);

        let emails = [];
        json.forEach(email => emails.push({ value: email.email, primary: email.primary, verified: email.verified }));
        profile.email = parseEmails(emails);

        done(null, profile);
      });
    });
  }
}

module.exports = Strategy;