import { execSync } from 'child_process';

exports.command = function drush(command = 'status', callback) {
  const self = this;
  let procResult = '';

  try {
    const proc = execSync(
      `../vendor/bin/drush --uri=${
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
