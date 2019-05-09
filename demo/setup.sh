#!/bin/sh
set -e

sudo chown -R nginx:nginx /var/www/.composer

# If settings.php doesn't exist, create it and install Drupal
if [ ! -f  docroot/sites/default/settings.php ]; then
    echo "settings.php not detected - installing Drupal (this may take some time, wait for a one-time login link to appear!)"
    sudo chmod 755 docroot/sites/default
    sudo rm -rf \
      composer.json \
      composer.lock \
      config \
      docroot/.ht.router.php \
      docroot/core \
      docroot/modules \
      docroot/sites/default/files \
      docroot/sites/default/settings.php \
      docroot/sites/default/services.yml \
      docroot/sites/simpletest \
      docroot/vfancy \
      reports \
      vendor
    cp docroot/sites/default/default.settings.php docroot/sites/default/settings.php
    echo "\$settings['trusted_host_patterns'] = [
  '^drupal\$',
  '^127\.0\.0\.1\$',
];" >> docroot/sites/default/settings.php
    cp templates/composer.json composer.json
    cp templates/composer.lock composer.lock
    cp templates/.ht.router.php docroot/.ht.router.php
    echo "\$config_directories['sync'] = '../config/sync';" >> docroot/sites/default/settings.php
    mkdir docroot/sites/default/files docroot/sites/simpletest reports
    chmod 777 docroot/sites/default/files
    composer install
    composer config repositories.repo-name path "/var/www/admin_ui_support"
    COMPOSER_MEMORY_LIMIT=-1 composer require justafish/drupal-admin-ui-support:dev-master
    drush site:install demo_umami -y --db-url=mysql://drupal:drupal@mysql:3306/drupal --sites-subdir=default
    drush en -y jsonapi admin_ui_support admin_ui_widget_example
    drush config:set -y system.logging error_level verbose
    rm -rf docroot/vfancy
    ln -s /var/www/admin-ui/build/ docroot/vfancy
fi

echo "##############################################################################################
# One time login URL                                                                         #
# $(drush user:login) #
##############################################################################################"
