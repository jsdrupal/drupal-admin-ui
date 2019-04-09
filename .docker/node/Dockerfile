FROM node:10-alpine

ARG NODE_UID
ARG NODE_GID
ENV NODE_UID "$NODE_UID"
ENV NODE_GID "$NODE_GID"

RUN apk add shadow sudo chromium chromium-chromedriver

ADD .docker/moveUser.sh /root/moveUser.sh

RUN mkdir -p /var/www && \
    deluser node && \
    HOST_UID=${NODE_UID} HOST_GID=${NODE_GID} /bin/sh /root/moveUser.sh && \
    sed -i 's/^CREATE_MAIL_SPOOL=yes/CREATE_MAIL_SPOOL=no/' /etc/default/useradd && \
    groupadd -g ${NODE_GID} node && \
    useradd -u ${NODE_UID} -d /var/www -g ${NODE_GID} node && \
    sed -e 's/# %wheel ALL=(ALL) NOPASSWD: ALL/%wheel ALL=(ALL) NOPASSWD: ALL/g' -i /etc/sudoers && \
    usermod -a -G wheel node && \
    chown node:node /var/www

USER node

RUN mkdir -p /var/www/drupal-admin-ui
WORKDIR /var/www/drupal-admin-ui

EXPOSE 3000

ENTRYPOINT ["sh", "/var/www/drupal-admin-ui/.docker/node/setup.sh"]
