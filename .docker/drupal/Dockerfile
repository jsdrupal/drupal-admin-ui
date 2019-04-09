FROM alpine:3.8

ARG NGINX_UID
ARG NGINX_GID
ENV NGINX_UID "$NGINX_UID"
ENV NGINX_GID "$NGINX_GID"

ADD .docker/moveUser.sh /root/moveUser.sh

RUN apk add shadow sudo supervisor && \
    sed -i 's/^CREATE_MAIL_SPOOL=yes/CREATE_MAIL_SPOOL=no/' /etc/default/useradd && \
    HOST_UID=${NGINX_UID} HOST_GID=${NGINX_GID} /bin/sh /root/moveUser.sh && \
    groupadd -g ${NGINX_GID} nginx && \
    useradd -u ${NGINX_UID} -d /var/www -g ${NGINX_GID} nginx && \
    sed -e 's/# %wheel ALL=(ALL) NOPASSWD: ALL/%wheel ALL=(ALL) NOPASSWD: ALL/g' -i /etc/sudoers && \
    usermod -a -G wheel nginx && \
    apk add php sqlite composer git \
    php7-pdo php7-sqlite3 php7-pdo_sqlite php7-gd php7-openssl php7-json \
    php7-mbstring php7-dom php7-session php7-xml php7-simplexml php7-tokenizer \
    php7-curl php7-xmlwriter php7-ctype php7-opcache php7-pdo_mysql mysql-client \
    nginx php7-fpm php7-xdebug && \
    sed -i 's/;opcache.enable=1/opcache.enable=1/' /etc/php7/php.ini && \
    sed -i 's/user = nobody/user = nginx/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/group = nobody/group = nginx/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/listen = 127.0.0.1:9000/listen = \/var\/run\/nginx\/php-fpm7.sock/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/;listen.allowed_clients = 127.0.0.1/listen.allowed_clients = 127.0.0.1/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/;listen.owner = nobody/listen.owner = nginx/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/;listen.group = nginx/listen.group = nginx/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/;listen.mode = 0660/listen.mode = 0660/' /etc/php7/php-fpm.d/www.conf && \
    sed -i "s/\[supervisord\]/\[supervisord\]\nuser=root    ;/" /etc/supervisord.conf && \
    mkdir -p /run/nginx && \
    chown nginx:nginx /var/www

ADD .docker/drupal/nginx-default.conf /etc/nginx/conf.d/default.conf
ADD .docker/drupal/supervisord.conf /etc/supervisor.d/default.ini

USER nginx

ADD demo /var/www/drupal
ADD admin_ui_support /var/www/admin_ui_support

WORKDIR /var/www/drupal
ENV PATH="/var/www/drupal/vendor/bin:${PATH}"

EXPOSE 80

ENTRYPOINT ["sh", "/var/www/.docker/drupal/setup.sh"]
