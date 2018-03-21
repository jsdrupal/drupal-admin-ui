![Demo of vfancy falling back to Drupal for an unknown route](https://i.imgur.com/JW7CdkZ.gifv)

# Installation

```
git clone https://github.com/drupal/drupal
git clone https://github.com/jsdrupal/drupal-admin-ui

cd drupal-admin-ui
yarn install
yarn build

# Link vfancy to Drupal
cd ../drupal
ln -s ../drupal-admin-ui/build vfancy

## Link the support module to Drupal
cd ../drupal/modules
ln -s ../../drupal-admin-ui/admin_ui_support .

## Download the jsonapi module
curl -O https://ftp.drupal.org/files/projects/jsonapi-8.x-1.13.tar.gz
tar zxf jsonapi-8.x-1.13.tar.gz

# Install Drupal
@todo Use the dev-site command
composer install

## Install the support module
drush en admin_ui_support -y

# Start the webserver
php -S localhost:8000
```

- Open `http://localhost:8000` and install with SQLite
- Visit `http://localhost:8000/vfancy`

# For Local Development

- Copy `.env` to `.env.local` and comment out `PUBLIC_URL`
- Start the Webpack dev server with `yarn start`
- Visit `http://localhost:3000/`
