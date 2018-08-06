module.exports = {
  '@tags': ['AdminContent'],
  adminContentRenders(browser) {
    browser
      .logUserIn()
      .relativeURL('/admin/content')
      .waitForElementVisible('[data-nightwatch="content-type-select"]');

    browser.click('[data-nightwatch="content-type-select"]');

    browser.expect.element('#menu-content-type ul>li[data-value="article"]').to.be.visible;

    browser.expect.element('#menu-content-type ul>li[data-value="page"]').to.be.visible;

    browser.expect.element('#menu-content-type ul>li[data-value="recipe"]').to.be.visible;

    browser.end();
  },
};
