exports.command = function logUserIn(
  { username = 'admin', password } = {},
  callback,
) {
  const self = this;
  const loginPassword =
    password || process.env[`NIGHTWATCH_LOGIN_${username}_PASSWORD`];
  if (loginPassword) {
    this.url(`${process.env.REACT_APP_DRUPAL_BASE_URL}/user/login`)
      .waitForElementPresent(
        'form.user-login-form input[data-drupal-selector="edit-name"]',
        2000,
      )
      .setValue(
        'form.user-login-form input[data-drupal-selector="edit-name"]',
        username,
      )
      .setValue(
        'form.user-login-form input[data-drupal-selector="edit-pass"]',
        loginPassword,
      )
      .click('form.user-login-form input[data-drupal-selector="edit-submit"]')
      .waitForElementPresent('h1.page-title', 2000)
      .assert.containsText('h1.page-title', username);
  } else {
    this.drush(`user:login --name=${username} --no-browser`, loginUrl => {
      this.url(loginUrl)
        .waitForElementVisible('#edit-account', 4000)
        .assert.containsText('.form-type-email label', 'Email address')
        .getCookies(result => {
          const sessionExists = !!result.sessionId;
          this.assert.strictEqual(sessionExists, true);
        });
    });
  }

  if (typeof callback === 'function') {
    callback.call(self);
  }
  return this;
};
