module.exports = {
  '@tags': ['AdminContent'],
  adminContentRenders(browser) {
    browser
      .logUserIn()
      .relativeURL('/admin/content')
      .waitForElementVisible('[data-nightwatch="content-type-select"]');

    browser.click('[data-nightwatch="content-type-select"]');

    browser.expect
      .element('#menu-content-type ul>li:nth-child(1)')
      .to.have.attribute('data-value')
      .equals('article');

    browser.expect
      .element('#menu-content-type ul>li:nth-child(2)')
      .to.have.attribute('data-value')
      .equals('page');

    browser.expect
      .element('#menu-content-type ul>li:nth-child(3)')
      .to.have.attribute('data-value')
      .equals('recipe');

    browser.end();
  },
};
