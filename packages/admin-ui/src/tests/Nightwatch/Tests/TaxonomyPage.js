module.exports = {
  '@tags': ['TaxonomyPage'],
  taxonomyPage(browser) {
    browser
      .logUserIn()
      .relativeURL('/admin/structure/taxonomy')
      .waitForElementVisible('th');

    browser.getText('th:nth-child(1)', function coloumnName(text) {
      this.assert.equal(text.value.toLowerCase(), 'vocabulary name');
    });

    browser.getText('th:nth-child(2)', function coloumnName(text) {
      this.assert.equal(text.value.toLowerCase(), 'description');
    });

    browser.getText('th:nth-child(3)', function coloumnName(text) {
      this.assert.equal(text.value.toLowerCase(), 'operations');
    });

    browser
      .waitForElementVisible('div[class^="MuiSelect-select"]')
      .click('div[class^="MuiSelect-select"]');

    browser.waitForElementVisible('#menu-');

    browser.getText('#menu- ul li:nth-child(1)', function menuItem(text) {
      this.assert.equal(text.value.toLowerCase(), 'list terms');
    });

    browser.getText('#menu- ul li:nth-child(2)', function menuItem(text) {
      this.assert.equal(text.value.toLowerCase(), 'edit vocabulary');
    });

    browser.getText('#menu- ul li:nth-child(3)', function menuItem(text) {
      this.assert.equal(text.value.toLowerCase(), 'add terms');
    });

    browser.getText('#menu- ul li:nth-child(4)', function menuItem(text) {
      this.assert.equal(text.value.toLowerCase(), 'manage dields');
    });

    browser.getText('#menu- ul li:nth-child(5)', function menuItem(text) {
      this.assert.equal(text.value.toLowerCase(), 'manage form display');
    });

    browser.getText('#menu- ul li:nth-child(6)', function menuItem(text) {
      this.assert.equal(text.value.toLowerCase(), 'manage display');
    });

    browser.click('#menu- ul li:nth-child(1)');

    browser.url(function assertCurrentUrl(currentUrl) {
      this.assert.equal(
        currentUrl.value,
        `${
          process.env.NIGHTWATCH_URL
        }/admin/structure/taxonomy/manage/recipe_category/overview`,
      );
    });
  },
};
