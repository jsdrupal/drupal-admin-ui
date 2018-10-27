module.exports = {
  '@tags': ['NodeForm'],
  nodeEditFormRestoring(browser) {
    browser
      .logUserIn()
      .relativeURL('/admin/content')
      .waitForElementVisible('[data-nightwatch="content-type-select"]');

    browser.waitForElementVisible(
      '[data-nightwatch="Edit Super easy vegetarian pasta bake"]',
    );

    // Click 'Edit' for 'Super easy vegetarian pasta bake'
    browser.click('[data-nightwatch="Edit Super easy vegetarian pasta bake"]');

    // Wait for `#title`
    browser.waitForElementVisible('#title');

    browser.expect
      .element('#title')
      .value.to.equal('Super easy vegetarian pasta bake');

    // Clear the `#title` value
    browser
      .betterClearValue('#title')
      .expect.element('#title')
      .value.to.equal('');

    // Set a temporary value
    browser.setValue('#title', 'Self made pasta');

    browser
      .relativeURL('/admin/content')
      .waitForElementVisible('[data-nightwatch="content-type-select"]');

    browser.waitForElementVisible(
      '[data-nightwatch="Edit Super easy vegetarian pasta bake"]',
    );

    browser.click('[data-nightwatch="Edit Super easy vegetarian pasta bake"]');

    browser
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
