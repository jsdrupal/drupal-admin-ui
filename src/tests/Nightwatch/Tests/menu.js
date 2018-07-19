module.exports = {
  '@tags': ['menu'],
  menuRenders(browser) {
    browser
      .logUserIn()
      .relativeURL('/')
      .waitForElementVisible('button[aria-label="open drawer"]')
      .click('button[aria-label="open drawer"]')
      .waitForElementVisible('[data-nightwatch="menu"] a[role="button"]')
      .getText('[data-nightwatch="menu"] a[role="button"]', function menuText(
        result,
      ) {
        this.assert.strictEqual(result.value, 'Content');
      });
  },
};
