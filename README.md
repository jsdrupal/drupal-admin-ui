# vfancy 
![Demo of vfancy falling back to Drupal for an unknown route](https://i.imgur.com/JW7CdkZ.gifv)

- [vfancy](#vfancy)
  * [Installation](#installation)
    + [For Local Development](#For-local-development)
  * [Contributing to This Repository](#contributing-to-this-repository)     

## Installation

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

### For Local Development

- Copy `.env` to `.env.local` and comment out `PUBLIC_URL`
- Start the Webpack dev server with `yarn start`
- Visit `http://localhost:3000/`

## Contributing to This Repository

- [Fork this repo](https://help.github.com/articles/fork-a-repo/) to your own user and make your proposed changes
- [Make a pull request](https://help.github.com/articles/about-pull-requests/)!
- Our [issue queue](https://github.com/jsdrupal/drupal-admin-ui/issues) is public and you already have the required permissions to participate. However in order to perform administrative tasks such as assign issues to yourself and others, or edit labels, make a request in #javascript in [Drupal Slack](https://www.drupal.org/slack) to be added as a member of the [Contribtors Team](https://github.com/orgs/jsdrupal/teams/contributors)

If someone has made a pull request and you would like to add code to their branch, there are a number of ways to move forward. It will be very helpful to get familiar with [managing remotes](https://help.github.com/categories/managing-remotes/) in Git.

	- First, ping them in #javascript to discuss the addition/changes!
	- Once agreed, you can make a pull request to their fork/branch, which once accepted will appear in the pull request to the main jsdrupal/drupal-admin-ui repo
	- Alternatively, they could give you access to modify their branch directly at https://github.com/<username>/drupal-admin-ui/settings/collaboration (although bear in mind this will give access to their entire repository fork)
	- Or, if you're unable to agree or get in touch with the author, you could create a new pull request that incorporates the work from their branch
	```
	git remote add <their-username> git@github.com:<their-username>/drupal-admin-ui.git
	git fetch <their-username>
	git checkout -b <branch-name> <their-username>/<branch-name>
	.
	.
	.
	git push <your-fork> <branch-name>
	```

