FROM node:10-alpine

RUN mkdir -p /root/drupal-admin-ui
WORKDIR /root/drupal-admin-ui

ADD package.json /root/drupal-admin-ui/
ADD yarn.lock /root/drupal-admin-ui/
ADD packages /root/drupal-admin-ui/packages/

RUN yarn install && \
    cp packages/admin-ui/.env packages/admin-ui/.env.local && \
    echo 'REACT_APP_DRUPAL_BASE_URL="http://127.0.0.1"' >> packages/admin-ui/.env.local && \
    echo 'REACT_APP_DRUPAL_ROOT="/"' >> packages/admin-ui/.env.local && \
    yarn workspace admin-ui build

EXPOSE 3000

ENTRYPOINT ["yarn", "workspace", "admin-ui", "start" ]
