/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
const parseUser = (json) => {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var profile = {};
  profile = {
    githubId: json.id,
    githubLogin: json.login,
    firstName: json.name ? json.name.split(' ', 2)[0] || '' : '',
    lastName: json.name ? json.name.split(' ', 2)[1] || '' : '',
    emails: json.email && [{ value: json.email }],
    location: json.location,
    website: json.blog,
    picture: json.avatar_url
  };
  return profile;
};

const parseEmails = (emails) => {
  /*
    Profile emails will return an array like this:
    let emails = [
      { value: 'foo@bar.com', primary: false, verified: false },
      { value: 'murat@foobar.net', primary: false, verified: false },
      { value: 'test@test.com', primary: true, verified: false },
      { value: 'test2@test.com', primary: false, verified: true },
      { value: 'myemail@gmail.com', primary: true, verified: true },
    ];
    we want to sort this list such that primary verified email is at loc 0
  */
  emails.sort((a, b) => {
    if (a.primary === b.primary) {
      if (a.verified === b.verified) {
        return 0;
      }
      if (a.verified) {
        return -1;
      } else {
        return 1;
      }
    }
    if (a.primary) {
      return -1;
    } else {
      return 1;
    }
  })

  return emails[0].value;
}

module.exports = { parseUser, parseEmails };