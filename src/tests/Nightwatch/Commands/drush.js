import { execSync } from 'child_process';

exports.command = function drush(command = 'status', callback) {
  const self = this;
  let procResult = '';

  try {
    if (!process.env.REACT_APP_DRUPAL_ROOT) {
      throw new Error(
        'Missing REACT_APP_DRUPAL_ROOT environment variable, please set it in the .env.local file.',
      );
    }

    const proc = execSync(
      `${process.env.REACT_APP_DRUPAL_ROOT}/vendor/bin/drush --uri=${
        process.env.REACT_APP_DRUPAL_BASE_URL
      } ${command}`,
    );
    procResult = proc.toString();
  } catch (error) {
    this.assert.fail(error);
  }

  // Nightwatch doesn't like it when no actions are added in command file.
  this.pause(1);

  if (typeof callback === 'function') {
    callback.call(self, procResult);
  }
  return this;
};
