module.exports = {
  '@tags': ['NodeForm'],
  nodeEditFormRestoring(browser) {
    browser
      .logUserIn()
      .relativeURL('/node/9/edit')
      .waitForElementVisible('#title');

    browser.expect
      .element('#title')
      .value.to.equal('Super easy vegetarian pasta bake');

    browser
      .clearValue('#title')
      .expect.element('#title')
      .value.to.equal('');

    browser.setValue('#title', 'Self made pasta');

    browser
      .relativeURL('/node/9/edit')
      .waitForElementVisible('#title')
      .waitForElementVisible('[data-nightwatch="restore-content-snackbar"]');

    browser.expect
      .element('#title')
      .value.to.equal('Super easy vegetarian pasta bake');

    browser.click(
      '[data-nightwatch="restore-content-snackbar"] button:first-of-type',
    );
    browser.waitForElementNotPresent(
      '[data-nightwatch="restore-content-snackbar"]',
    );

    browser.expect.element('#title').value.to.equal('Self made pasta');

    browser.end();
  },
};
