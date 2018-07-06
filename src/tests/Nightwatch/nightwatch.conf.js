/* eslint-disable import/no-extraneous-dependencies */
// Ensure environment variables are read.
require('babel-register');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'nightwatch';
process.env.NODE_ENV = 'nightwatch';
// Ensure environment variables are read.
require('react-scripts/config/env');

const chromeArgs = ['--disable-notifications'];
if (
  !process.env.NIGHTWATCH_HEADLESS_CHROME ||
  !JSON.parse(process.env.NIGHTWATCH_HEADLESS_CHROME)
) {
  chromeArgs.push('--headless');
}

module.exports = {
  src_folders: ['src/tests/Nightwatch/Tests'],
  output_folder: 'reports/nightwatch',
  custom_commands_path: ['src/tests/Nightwatch/Commands'],
  page_objects_path: '',
  globals_path: 'src/tests/Nightwatch/globals.js',
  selenium: {
    start_process: false,
  },
  test_settings: {
    default: {
      selenium_port: 9515,
      selenium_host: 'localhost',
      request_timeout_options: {
        timeout: 30000,
        retry_attempts: 5,
      },
      default_path_prefix: '',
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
      end_session_on_fail: false,
    },
  },
};
