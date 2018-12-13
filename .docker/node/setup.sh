#!/bin/sh

if [ ! -f /root/drupal-admin-ui/packages/admin-ui/.env.local ]; then
    cp packages/admin-ui/.env packages/admin-ui/.env.local
fi

yarn install
yarn workspace admin-ui build
yarn workspace admin-ui start
