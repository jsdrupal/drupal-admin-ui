#!/bin/sh
set -e
until docker exec -it drupal_admin_ui_drupal test -e /var/www/.drupal-installation-complete && docker exec -it drupal_admin_ui_node test -e /var/www/drupal-admin-ui/.yarn-build-complete
do
    sleep 20
done

# Wait for Apache and Webpack Dev Server to start
sleep 10
echo "Containers are ready!"

return 0
