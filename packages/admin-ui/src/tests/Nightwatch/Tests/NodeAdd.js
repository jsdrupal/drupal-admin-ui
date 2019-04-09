module.exports = {
  '@tags': ['NodeForm'],
  nodeEditFormRestoring(browser) {
    browser
      .logUserIn()
      .relativeURL('/node/add/article')
      .waitForElementVisible('#title');

    browser.setValue('#title', 'this is my first title');

    browser
      .relativeURL('/node/add/article')
      .waitForElementVisible('#title')
      .waitForElementVisible(
        '[data-nightwatch="restore-content-snackbar"] button:first-of-type',
      );

    browser.expect.element('#title').value.to.equal('');

    browser.click(
      '[data-nightwatch="restore-content-snackbar"] button:first-of-type',
    );
    browser.waitForElementNotPresent(
      '[data-nightwatch="restore-content-snackbar"]',
    );

    browser.expect.element('#title').value.to.equal('this is my first title');

    browser.end();
  },
};
