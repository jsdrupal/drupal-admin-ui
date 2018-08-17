module.exports = {
  '@tags': ['AddContent'],
  addContentRenders(browser) {
    browser
      .logUserIn()
      .relativeURL('/node/add')
      .waitForElementVisible('[data-nightwatch="node-type-list"] a');

    browser.expect
      .element(
        '[data-nightwatch="node-type-list"] li:nth-child(1) a span:first-child',
      )
      .text.to.equal('Article');

    browser.expect
      .element(
        '[data-nightwatch="node-type-list"] li:nth-child(2) a span:first-child',
      )
      .text.to.equal('Basic page');

    browser.expect
      .element(
        '[data-nightwatch="node-type-list"] li:nth-child(3) a span:first-child',
      )
      .text.to.equal('Recipe');

    browser.end();
  },
};
