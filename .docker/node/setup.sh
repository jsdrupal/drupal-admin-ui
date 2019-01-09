#!/bin/sh

rm -f /var/www/.yarn-build-complete

if [ ! -f /var/www/drupal-admin-ui/packages/admin-ui/.env.local ]; then
    cp packages/admin-ui/.env packages/admin-ui/.env.local
    chmod 666 packages/admin-ui/.env.local
fi

sudo chown -R node:node /var/www/.cache
yarn install
yarn workspace admin-ui build

# Create a file to indicate build has finished
touch /var/www/.yarn-build-complete

yarn workspace admin-ui start
