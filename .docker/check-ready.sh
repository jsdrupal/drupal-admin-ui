#!/bin/sh
until docker exec -it drupal_admin_ui_drupal test -e ~/.drupal-installation-complete && docker exec -it drupal_admin_ui_node test -e /root/.yarn-build-complete
do
    sleep 20
done

# Wait for Apache and Webpack Dev Server to start
sleep 10
echo "Containers are ready!"

return 0
