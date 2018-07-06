module.exports = {
  '@tags': ['menu'],
  menuRenders(browser) {
    browser
      .logUserIn()
      .relativeURL('/')
      .waitForElementVisible('[data-nightwatch="menu"]', 1000)
      .getText('[data-nightwatch="menu"] a[role="button"]', function menuText(
        result,
      ) {
        console.log(result);
        this.assert.strictEqual(result.value, 'Content');
      });
  },
};
