#!/bin/sh
set -e

until  [ -f /var/www/drupal-admin-ui/.yarn-build-complete ]
do 
   echo 'waiting for yarn to be built in the node container';
   sleep 20;
done

yarn workspace admin-ui storybookInContainer
