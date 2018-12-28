#!/bin/sh

rm -f /root/.yarn-build-complete

if [ ! -f /root/drupal-admin-ui/packages/admin-ui/.env.local ]; then
    cp packages/admin-ui/.env packages/admin-ui/.env.local
    chmod 666 packages/admin-ui/.env.local
fi

yarn install
yarn workspace admin-ui build

# Create a file to indicate build has finished
touch /root/.yarn-build-complete

yarn workspace admin-ui start
