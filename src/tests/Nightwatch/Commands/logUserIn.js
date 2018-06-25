exports.command = function logUserIn(username = 'admin', callback) {
  const self = this;
  this.drush(`user:login --name=${username} --no-browser`, loginUrl => {
    this.url(loginUrl)
      .waitForElementVisible('#edit-account', 4000)
      .assert.containsText('.form-type-email label', 'Email address')
      .getCookies(result => {
        const sessionExists = !!result.sessionId;
        this.assert.strictEqual(sessionExists, true);
      });
  });

  if (typeof callback === 'function') {
    callback.call(self);
  }
  return this;
};
