![Demo of vfancy falling back to Drupal for an unknown route](https://i.imgur.com/JW7CdkZ.gifv)


```
git clone https://github.com/drupal/drupal
git clone https://github.com/jsdrupal/drupal-admin-ui

cd drupal-admin-ui
yarn install
yarn build

# Link vfancy to Drupal
cd ../drupal
ln -s ../drupal-admin-ui/build vfancy

# Install Drupal and start webserver
composer install
php -S localhost:8000
```

- Open `http://localhost:8000` and install with SQLite
- Visit `http://localhost:8000/vfancy`
