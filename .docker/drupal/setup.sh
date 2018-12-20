#!/bin/sh

rm -f /root/.drupal-installation-complete

# If settings.php doesn't exist, create it and install Drupal
if [ ! -f /var/www/drupal/docroot/sites/default/settings.php ]; then
    echo "settings.php not detected - installing Drupal (this may take some time, wait for a one-time login link to appear!)"
    rm -rf config composer.json composer.lock vendor docroot/.ht.router.php docroot/core docroot/modules docroot/sites/default/files docroot/sites/default/settings.php docroot/sites/default/services.yml
    cp /var/www/drupal/docroot/sites/default/default.settings.php /var/www/drupal/docroot/sites/default/settings.php
    echo "\$settings['trusted_host_patterns'] = [
  '^drupal\$',
  '^127\.0\.0\.1\$',
];" >> /var/www/drupal/docroot/sites/default/settings.php
    cp templates/composer.json composer.json
    cp templates/composer.lock composer.lock
    cp templates/.ht.router.php docroot/.ht.router.php
    echo "\$config_directories['sync'] = '../config/sync';" >> /var/www/drupal/docroot/sites/default/settings.php
    composer config repositories.repo-name path "/var/www/admin_ui_support"
    composer require justafish/drupal-admin-ui-support:dev-master
    composer install
    chmod +x /var/www/drupal/docroot/core/scripts/drupal
    drush site:install demo_umami -y --db-url=mysql://drupal:drupal@mysql:3306/drupal --sites-subdir=default
    drush en -y jsonapi admin_ui_support admin_ui_widget_example
    drush config:set -y system.logging error_level verbose
fi

rm -rf docroot/sites/default/files/styles reports
mkdir reports
chown apache:apache reports

echo "##############################################################################################
# One time login URL                                                                         #
# $(drush user:login) #
##############################################################################################"

# Create a file to indicate installation has finished
touch /root/.drupal-installation-complete

apachectl start -DFOREGROUND
