SHELL := /bin/sh
PATH := bin:$(PATH)

build:
	docker-compose rm -vsf
	docker-compose down -v --remove-orphans
	uid=$$(id -u) gid=$$(id -g) docker-compose build

up:
	docker-compose up

node\:cli:
	docker exec -it drupal_admin_ui_node /bin/sh

drupal\:cli:
	docker exec -it drupal_admin_ui_drupal /bin/sh

drupal\:reinstall:
	sudo rm demo/docroot/sites/default/settings.php

###############################################################################################
# To enable XDebug, you will need to append your local ip address, and optionally your idekey #
# e.g. IP=10.0.1.5 IDEKEY=PHPSTORM make xdebug:enable                                         #
# If using PHPStorm, add a server under PHP / Servers and set Name to "127.0.0.1"             #
###############################################################################################
xdebug\:enable:
	docker exec -u root -it drupal_admin_ui_drupal /bin/sh -c 'echo -e "zend_extension=xdebug.so\n\
	 xdebug.remote_enable=1\n\
	 xdebug.remote_autostart=on\n\
	 xdebug.remote_host=${IP}\n\
	 xdebug.idekey=${IDEKEY}" > /etc/php7/conf.d/xdebug.ini'

xdebug\:disable:
	docker exec -u root -it drupal_admin_ui_drupal echo "" > /etc/php7/conf.d/xdebug
