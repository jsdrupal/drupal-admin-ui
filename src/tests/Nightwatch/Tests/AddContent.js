module.exports = {
  '@tags': ['AddContent'],
  addContentRenders(browser) {
    browser
      .logUserIn()
      .relativeURL('/node/add')
      .waitForElementVisible('[data-nightwatch="node-type-list"] a', 10000)
      .getText(
        '[data-nightwatch="node-type-list"] a:nth-child(1) span:first-child',
        function testArticleShow(result) {
          this.assert.strictEqual(result.value, 'Article');
        },
      )
      .getText(
        '[data-nightwatch="node-type-list"] a:nth-child(2) span:first-child',
        function testBasicPageShow(result) {
          this.assert.strictEqual(result.value, 'Basic page');
        },
      )
      .getText(
        '[data-nightwatch="node-type-list"] a:nth-child(3) span:first-child',
        function testRecipeShows(result) {
          this.assert.strictEqual(result.value, 'Recipe');
        },
      )
      .end();
  },
};
