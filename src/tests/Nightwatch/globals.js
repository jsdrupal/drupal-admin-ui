/* eslint-disable import/no-extraneous-dependencies */
import chromedriver from 'chromedriver';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';

module.exports = {
  asyncHookTimeout: 60000,
  before(done) {
    chromedriver.start();
    done();
  },
  after(done) {
    chromedriver.stop();
    done();
  },
  afterEach(browser, done) {
    if (
      !browser.drupalLogConsoleOnlyOnError ||
      browser.currentTest.results.errors > 0 ||
      browser.currentTest.results.failed > 0
    ) {
      const resultPath = path.join(__dirname, '../../../reports/nightwatch');
      const status =
        browser.currentTest.results.errors > 0 ||
        browser.currentTest.results.failed > 0
          ? 'FAILED'
          : 'PASSED';
      mkdirp.sync(resultPath);
      const now = new Date().toString().replace(/[\s]+/g, '-');
      const testName = (
        browser.currentTest.name || browser.currentTest.module
      ).replace(/[\s/]+/g, '-');
      browser
        .getLog('browser', logEntries => {
          const browserLog = JSON.stringify(logEntries, null, '  ');
          fs.writeFileSync(
            `${resultPath}/${testName}_${status}_${now}_console.json`,
            browserLog,
          );
        })
        .execute(() => window.performance.getEntries(), [], result => {
          let networkLog = '';
          if (result && result.value && result.value.length) {
            result.value.forEach(entry => {
              networkLog += `${entry.name}\n`;
              networkLog += `${JSON.stringify(entry, null, 2)}\n`;
              networkLog += '\n';
            });
          }
          fs.writeFileSync(
            `${resultPath}/${testName}_${status}_${now}_networkLog.json`,
            networkLog,
          );
        });
    }
    browser.end(done);
  },
};
