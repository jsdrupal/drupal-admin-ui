FROM alpine:3.8 AS dependencies

ARG HOST_UID
ARG HOST_GID

ADD .docker/scripts/createUser.sh /root/createUser.sh

RUN apk add shadow sudo supervisor make \
        php sqlite composer git \
        php7-pdo php7-gd php7-openssl php7-json php7-mbstring php7-dom php7-session php7-xml php7-simplexml \
        php7-tokenizer php7-curl php7-xmlwriter php7-ctype php7-opcache php7-pdo_mysql mysql-client php7-fpm \
        php7-xdebug && \
    sed -i 's/^CREATE_MAIL_SPOOL=yes/CREATE_MAIL_SPOOL=no/' /etc/default/useradd && \
    sed -e 's/# %wheel ALL=(ALL) NOPASSWD: ALL/%wheel ALL=(ALL) NOPASSWD: ALL/g' -i /etc/sudoers && \
    sed -i 's/\[supervisord\]/\[supervisord\]\nuser=root    ;/' /etc/supervisord.conf && \
    sed -i 's/;opcache.enable=1/opcache.enable=1/' /etc/php7/php.ini && \
    sed -i 's/user = nobody/user = nginx/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/group = nobody/group = nginx/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/listen = 127.0.0.1:9000/listen = \/var\/run\/nginx\/php-fpm7.sock/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/;listen.allowed_clients = 127.0.0.1/listen.allowed_clients = 127.0.0.1/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/;listen.owner = nobody/listen.owner = nginx/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/;listen.group = nginx/listen.group = nginx/' /etc/php7/php-fpm.d/www.conf && \
    sed -i 's/;listen.mode = 0660/listen.mode = 0660/' /etc/php7/php-fpm.d/www.conf && \
    NAME="nginx" HOST_UID=$HOST_UID HOST_GID=$HOST_GID /bin/sh /root/createUser.sh && rm /root/createUser.sh && \
    apk add nginx && \
    mkdir -p /run/nginx && \
    mkdir -p /var/www/.composer && \
    mkdir -p /var/www/.cache && \
    touch /var/www/.drupal-container && \
    chown -R nginx:nginx /var/www

ADD .docker/images/drupal/nginx-default.conf /etc/nginx/conf.d/default.conf
ADD .docker/images/drupal/supervisord.conf /etc/supervisor.d/default.ini

FROM dependencies AS install
USER nginx
WORKDIR /var/www/drupal
ENV PATH="/var/www/drupal/vendor/bin:${PATH}"
RUN composer global require hirak/prestissimo

FROM install AS start
EXPOSE 80
ENTRYPOINT ["sudo", "supervisord", "-c", "/etc/supervisord.conf"]
