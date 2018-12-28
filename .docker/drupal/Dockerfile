FROM alpine:3.8

RUN apk add php sqlite composer git \
    php7-pdo php7-sqlite3 php7-pdo_sqlite php7-gd php7-openssl php7-json \
    php7-mbstring php7-dom php7-session php7-xml php7-simplexml php7-tokenizer \
    php7-curl php7-xmlwriter php7-ctype php7-opcache php7-pdo_mysql mysql-client \
    php-apache2 apache2 apache2-ctl

ADD demo /var/www/drupal
ADD admin_ui_support /var/www/admin_ui_support

RUN rm -rf /var/www/localhost && \
    sed -i 's/\/var\/www\/localhost\/htdocs/\/var\/www\/drupal\/docroot/g' /etc/apache2/httpd.conf && \
    sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/g' /etc/apache2/httpd.conf && \
    sed -i '/<Directory "\/var\/www\/drupal\/docroot">/,/<\/Directory>/s/AllowOverride None/AllowOverride All/' /etc/apache2/httpd.conf && \
    sed -i 's/#ServerName www.example.com:80/ServerName 127.0.0.1:80/g' /etc/apache2/httpd.conf && \
    sed -i 's/;opcache.enable=1/opcache.enable=1/' /etc/php7/php.ini && \
    mkdir -p /run/apache2

WORKDIR /var/www/drupal
ENV PATH="/var/www/drupal/vendor/bin:${PATH}"

EXPOSE 80

ENTRYPOINT ["sh", "/root/.docker/drupal/setup.sh"]
