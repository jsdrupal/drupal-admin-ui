#!/bin/sh

# If settings.php doesn't exist, create it and install Drupal
if [ ! -f /var/www/drupal/docroot/sites/default/settings.php ]; then
    echo "settings.php not detected - installing Drupal"
    rm -rf config composer.json composer.lock vendor docroot/.ht.router.php docroot/core docroot/modules docroot/sites/default/files docroot/sites/default/settings.php docroot/sites/default/services.yml
    cp /var/www/drupal/docroot/sites/default/default.settings.php /var/www/drupal/docroot/sites/default/settings.php
    cp templates/composer.json composer.json
    cp templates/composer.lock composer.lock
    cp templates/.ht.router.php docroot/.ht.router.php
    echo "\$config_directories['sync'] = '../config/sync';" >> /var/www/drupal/docroot/sites/default/settings.php
    composer config repositories.repo-name path "/var/www/admin_ui_support"
    composer require justafish/drupal-admin-ui-support:dev-master
    composer install
    chmod +x /var/www/drupal/docroot/core/scripts/drupal
    ./docroot/core/scripts/drupal install demo_umami
    chmod 777 docroot/sites/default/files/.sqlite
    drush en -y jsonapi admin_ui_support admin_ui_widget_example
    drush config:set -y system.logging error_level verbose
fi

echo "
##############################################################################################
# One time login URL                                                                         #
# $(drush user:login) #
##############################################################################################"

apachectl start -DFOREGROUND
