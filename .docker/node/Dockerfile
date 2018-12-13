FROM node:10-alpine

RUN mkdir -p /root/drupal-admin-ui
WORKDIR /root/drupal-admin-ui

EXPOSE 3000

ENTRYPOINT ["sh", "/root/drupal-admin-ui/.docker/node/setup.sh"]
