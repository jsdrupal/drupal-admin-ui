module.exports = {
  '@tags': ['TaxonomyPage'],
  taxonomyPage(browser) {
    browser
      .logUserIn()
      .relativeURL('/admin/structure/taxonomy')
      .waitForElementVisible('th');

    browser.getText('th:nth-child(1)', function coloumnName(text) {
      this.assert.equal(text.value, 'Vocabulary name');
    });

    browser.getText('th:nth-child(2)', function coloumnName(text) {
      this.assert.equal(text.value, 'Description');
    });

    browser.getText('th:nth-child(3)', function coloumnName(text) {
      this.assert.equal(text.value, 'Operations');
    });

    browser
      .waitForElementVisible('[data-nightwatch="taxonomy-operations"] > div')
      .click('[data-nightwatch="taxonomy-operations"] > div');

    browser.waitForElementVisible('#menu-');

    browser.getText('#menu- ul li:nth-child(1)', function menuItem(text) {
      this.assert.equal(text.value, 'List Terms');
    });

    browser.getText('#menu- ul li:nth-child(2)', function menuItem(text) {
      this.assert.equal(text.value, 'Edit Vocabulary');
    });

    browser.getText('#menu- ul li:nth-child(3)', function menuItem(text) {
      this.assert.equal(text.value, 'Add Terms');
    });

    browser.getText('#menu- ul li:nth-child(4)', function menuItem(text) {
      this.assert.equal(text.value, 'Manage Fields');
    });

    browser.getText('#menu- ul li:nth-child(5)', function menuItem(text) {
      this.assert.equal(text.value, 'Manage Form Display');
    });

    browser.getText('#menu- ul li:nth-child(6)', function menuItem(text) {
      this.assert.equal(text.value, 'Manage Display');
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
