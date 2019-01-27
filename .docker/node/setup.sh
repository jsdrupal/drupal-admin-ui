#!/bin/sh
set -e

rm -f /var/www/drupal-admin-ui/.yarn-build-complete

sudo chown -R node:node /var/www/.cache

if [ ! -f /var/www/drupal-admin-ui/packages/admin-ui/.env.local ]; then
    cp packages/admin-ui/.env packages/admin-ui/.env.local
    chmod 666 packages/admin-ui/.env.local
fi

yarn install
yarn workspace admin-ui build

# Create a file to indicate build has finished
touch /var/www/drupal-admin-ui/.yarn-build-complete

yarn workspace admin-ui start
