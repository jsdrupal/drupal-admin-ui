/* eslint-disable import/no-extraneous-dependencies */
// Ensure environment variables are read.
require('babel-register');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'nightwatch';
process.env.NODE_ENV = 'nightwatch';
// Ensure environment variables are read.
require('react-scripts/config/env');

let chromeArgs = ['--disable-notifications'];
if (process.env.NIGHTWATCH_CHROME_ARGS) {
  chromeArgs = chromeArgs.concat(process.env.NIGHTWATCH_CHROME_ARGS.split(' '));
}

module.exports = {
  src_folders: ['src/tests/Nightwatch/Tests'],
  output_folder: 'reports/nightwatch',
  custom_commands_path: ['src/tests/Nightwatch/Commands'],
  page_objects_path: '',
  webdriver: {
    start_process: true,
    server_path: process.env.NIGHTWATCH_CHROMEDRIVER_PATH,
    cli_args: ['--verbose'],
    port: 9515,
  },
  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: chromeArgs,
          prefs: {
            credentials_enable_service: false,
            'profile.password_manager_enabled': false,
            'profile.default_content_settings.geolocation': 2,
          },
        },
        acceptSslCerts: true,
      },
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: 'reports/nightwatch/screenshots',
      },
    },
  },
};
