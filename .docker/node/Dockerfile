FROM node:10-alpine

RUN apk add chromium chromium-chromedriver

RUN mkdir -p /root/drupal-admin-ui
WORKDIR /root/drupal-admin-ui

EXPOSE 3000

ENTRYPOINT ["sh", "/root/drupal-admin-ui/.docker/node/setup.sh"]
