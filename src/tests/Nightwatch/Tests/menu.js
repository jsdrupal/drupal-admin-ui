module.exports = {
  '@tags': ['menu'],
  menuRenders(browser) {
    browser
      .logUserIn()
      .relativeURL('/')
      .waitForElementVisible('[data-nightwatch="menu"] a[role="button"]', 1000)
      .getText('[data-nightwatch="menu"] a[role="button"]', function menuText(
        result,
      ) {
        this.assert.strictEqual(result.value, 'Content');
      });
  },
};
