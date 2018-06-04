# Drupal Admin UI

This is an admin UI for Drupal, built with JavaScript and based on [create-react-app](https://github.com/facebook/create-react-app).

![Demo of vfancy falling back to Drupal for an unknown route](https://i.imgur.com/JW7CdkZ.gifv)

- [Drupal Admin UI](#drupal-admin-ui)
  * [Installation](#installation)
    + [Requirements](#requirements)
    + [Steps](#steps) 
  * [Running](#running)
  * [Developing](#developing)
  * [Commands](#commands)
  * [Contributing to This Repository](#contributing-to-this-repository)     

## Installation

### Requirements

- PHP 5.5.9 or greater
- PHP's pdo_sqlite extension installed. You can use `php -m` to check.
- SQLite 3 CLI package
  * For ubuntu users, `sudo apt install sqlite3`. You can use `sqlite3 --version` to check that the CLI is available.

### Steps

```
composer create-project jsdrupal/drupal-admin-ui-demo -s dev --prefer-dist
cd drupal-admin-ui-demo
composer run-script install
```

## Running
```
cd docroot
php core/scripts/drupal server
```

Try visiting one of the converted pages, e.g. the user permissions or roles page.

## Developing

- Ensure you have [Node 8](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed.
- Make sure the webserver is started with `composer run-script start`
- As we run the development environment as anonymous user right now, you need to grant them permissions.
- Please do that in the "production" environment, like ```http://localhost:56859/admin/people/permissions```. The permissions you want to grant at least are "administer users" and "Administer site configuration".
- Run `composer run-script devify`. You will now have a checkout of this repo in `drupal-admin-ui`.
It will also symlink the bundled production app to `docroot/vfancy`, and the support module to
`docroot/modules/contrib`.
- Edit `drupal-admin-ui/.env.local` and add in the URL for your currently running Drupal installation
that was output from the start command. e.g. for `Starting webserver on http://localhost:56859`, set
`REACT_APP_DRUPAL_BASE_URL=http://localhost:56859`
- Enter the repo with `cd drupal-admin-ui` and start the Webpack dev server with `yarn start`. This
will open a new window at `http://localhost:3000/`

The webpack dev server has hot reloading, however you won't be able to seamlessly switch between
Drupal and the React app. If you want to test out your changes in this context, enter the
`drupal-admin-ui` directory and run `yarn build`. You can then visit the URL that
`composer run-script start` generated.

## Commands

|`yarn run <script>`|Description|
|------------------|-----------|
|`start`|Serves your app at `localhost:3000`.|
|`build`|Compiles the application for production into folder `./build`.|
|`test`|Runs all available tests.|
|`test:unit`|Starts an interactive test runner for running unit tests with Jest.|
|`test:unit:ci`|Runs unit tests with Jest and outputs results with JUnit.|
|`test:lint`|Lints all files.|
|`test:lint:fix`|Fixes linter errors that can be solved automatically.|
|`test:lint:ci`|Lints all files and outputs results with JUnit.|

## Contributing to This Repository

- [Fork this repo](https://help.github.com/articles/fork-a-repo/) to your own user
- Set your fork as origin, and this repo as upstream. From inside the `drupal-admin-ui` folder:
  ```
  git remote rm origin
  git remote add origin git@github.com:<your-username>/drupal-admin-ui.git
  git remote add upstream git@github.com:jsdrupal/drupal-admin-ui.git
  ```
- Make your proposed changes on a [branch](https://guides.github.com/activities/hello-world/#branch) and then push them to your fork
  ```
  git push origin <your-branch>
  ```
- [Make a pull request](https://help.github.com/articles/about-pull-requests/)!
- Switch back to master and pull in the latest changes
  ```
  git checkout master
  git pull upstream master
  ```
- Our [issue queue](https://github.com/jsdrupal/drupal-admin-ui/issues) is public and you already have the required permissions to participate. However in order to perform administrative tasks, such as assigning issues or editing labels, make a request in #javascript in [Drupal Slack](https://www.drupal.org/slack) to be added as a member of the [Contributors Team](https://github.com/orgs/jsdrupal/teams/contributors)

If someone has made a pull request and you would like to add code to their branch, there are a number of ways to move forward. It will be very helpful to get familiar with [managing remotes](https://help.github.com/categories/managing-remotes/) in Git.

- First, ping them in #javascript to discuss the addition/changes!
- Once agreed, you can make a pull request to their fork/branch, which once accepted will appear in the pull request to the main jsdrupal/drupal-admin-ui repo
- Alternatively, they could give you access to modify their branch directly at https://github.com/<username>/drupal-admin-ui/settings/collaboration (although bear in mind this will give access to their entire repository fork)
- If you're unable to agree, or unable to get in touch with the author, you could create a new pull request that incorporates the work from their branch

  ```
  git remote add <their-username> git@github.com:<their-username>/drupal-admin-ui.git
  git fetch <their-username>
  git checkout -b <branch-name> <their-username>/<branch-name>
  .
  . work, commit things, etc
  .
  git push <your-fork> <branch-name>
  ```
