SHELL := /bin/sh
PATH := bin:$(PATH)

CREATE_ENV := $(shell if [ ! -f .env ]; then echo "\# Docker\nHOST_UID=\nHOST_GID=" | tee .env; fi)
RUN_DRUPAL := docker exec -it drupal_admin_ui_drupal /bin/sh -c

include .env.defaults
include .env

#############################################################
# Container Management                                      #
# See "docker-compose --help" for some useful commands      #
# e.g. "docker-compose logs -f" and "docker-compose events" #
#############################################################
build:
	HOST_UID=$$(id -u) HOST_GID=$$(id -g) docker-compose build

clean:
	make clean:docker
	make clean:files

clean\:docker:
	docker-compose rm -vsf
	docker-compose down -v --remove-orphans

clean\:files:
	sudo git clean -ffdX

vclean:
	make clean
	docker system prune

install:
	yarn install
	make drupal:install

##########
# Drupal #
##########
drupal\:cli:
	${RUN_DRUPAL} /bin/sh

drupal\:install:
	${RUN_DRUPAL} './setup.sh'

drupal\:reinstall:
	${RUN_DRUPAL} 'drush sql:drop --yes'
	sudo rm demo/docroot/sites/default/settings.php
	make drupal:install

# To enable XDebug, you will need to append your local ip address, and optionally your idekey
# e.g. IP=10.0.1.5 IDEKEY=PHPSTORM make drupal:xdebug:enable
# If using PHPStorm, add a server under PHP / Servers and set Name to "127.0.0.1"
drupal\:xdebug\:enable:
	docker exec -u root -it drupal_admin_ui_drupal /bin/sh -c 'echo -e "zend_extension=xdebug.so\n\
	 xdebug.remote_enable=1\n\
	 xdebug.remote_autostart=on\n\
	 xdebug.remote_host=${IP}\n\
	 xdebug.idekey=${IDEKEY}" > /etc/php7/conf.d/xdebug.ini'
	 docker exec -u root -it drupal_admin_ui_drupal supervisorctl restart php-fpm

drupal\:xdebug\:disable:
	docker exec -u root -it drupal_admin_ui_drupal /bin/sh -c 'echo "" > /etc/php7/conf.d/xdebug.ini'
	docker exec -u root -it drupal_admin_ui_drupal supervisorctl restart php-fpm
