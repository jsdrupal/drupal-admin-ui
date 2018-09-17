module.exports = {
  '@tags': ['NodeForm'],
  nodeEditFormRestoring(browser) {
    browser
      .logUserIn()
      .relativeURL('/admin/content')
      .waitForElementVisible('[data-nightwatch="content-type-select"]');

    browser.setValue(
      '[data-nightwatch="title-search-text-field"] input',
      'Super easy vegetarian pasta bake',
    );

    browser.waitForElementVisible('table tbody tr:only-child');

    browser.elements('css selector', 'table tbody tr', result => {
      browser.assert.equal(
        result.value.length,
        1,
        'Correctly filter content row.',
      );
    });

    // Click 'Edit' for 'Super easy vegetarian pasta bake'
    browser.click('table tbody tr:last-child td:last-child a');

    // Wait for `#title`
    browser.waitForElementVisible('#title');

    browser.expect
      .element('#title')
      .value.to.equal('Super easy vegetarian pasta bake');

    // Clear the `#title` value
    browser
      .clearValue('#title')
      .expect.element('#title')
      .value.to.equal('');

    // Set a temporary value
    browser.setValue('#title', 'Self made pasta');

    browser
      .relativeURL('/admin/content')
      .waitForElementVisible('[data-nightwatch="content-type-select"]');

    browser.setValue(
      '[data-nightwatch="title-search-text-field"] input',
      'Super easy vegetarian pasta bake',
    );

    browser.waitForElementVisible('table tbody tr:only-child');

    browser.click('table tbody tr:last-child td:last-child a');

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
