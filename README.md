# Drupal Admin UI

[![Greenkeeper badge](https://badges.greenkeeper.io/jsdrupal/drupal-admin-ui.svg)](https://greenkeeper.io/)

This is an admin UI for Drupal, built with JavaScript and based on [create-react-app](https://github.com/facebook/create-react-app).

- [Drupal Admin UI](#drupal-admin-ui)
  * [Installation](#installation)
    + [Requirements](#requirements)
    + [Steps](#steps)
  * [Running](#running)
  * [Developing](#developing)
    + [tl;dr](#tldr)
  * [Development guidelines](#development-guidelines)
  * [Commands](#commands)
  * [Contributing to This Repository](#contributing-to-this-repository)
  * [Extension Points Bundler](#extension-points-bundler)

## Installation

### Docker

Ensure that you currently have nothing running on port 80 or port 3000.

```
git clone git@github.com:jsdrupal/drupal-admin-ui.git
cd drupal-admin-ui
docker-compose up
```

As this is the first time starting the containers, the Drupal installation will take a little time.
It will be completed once you see:

```
drupal_admin_ui_drupal | ##############################################################################################
drupal_admin_ui_drupal | # One time login URL                                                                         #
drupal_admin_ui_drupal | # http://127.0.0.1/user/reset/1/1544503999/pOsRQl-VwQQKoJ25VRmKsdFw59KoWEl59Cc_L12QfZU/login #
drupal_admin_ui_drupal | ##############################################################################################

```

Open the link in your browser to log into Drupal. You will then have the following available:

| URL | Description |
|---|---|
| http://127.0.0.1 | Regular Drupal installation / JSON API endpoints |
| http://127.0.0.1/admin/content | A page taken over by the new admin UI. This uses the bundled version from `packages/admin-ui/build`, run `yarn workspace admin-ui build` in the node container to re-build |
| http://localhost:3000  | Webpack dev server with hot reloading |

#### Protips

##### Aliases

Instead of first entering the container to run commands (e.g. `docker exec -it drupal_admin_ui_node /bin/sh`),
you can create an alias to run commands directly in the containers, e.g.
```
alias admin_ui_drupal='function _admin_ui_drupal() { docker exec -it drupal_admin_ui_drupal $@ };_admin_ui_drupal'
admin_ui_drupal drush status
```

or

```
alias admin_ui_node='function _admin_ui_node() { docker exec -it drupal_admin_ui_node $@ };_admin_ui_node'
admin_ui_node yarn workspace admin-ui nightwatch
```

##### Re-installing Drupal
Deleting `demo/docroot/sites/default/settings.php` will cause the installation to run again
next time you bring your containers up (warning: this will wipe your entire Drupal installation!)

#### Nightwatch
- Change your password in Drupal
- Copy `packages/admin-ui/.env` to `packages/admin-ui/.env.local`
- Uncomment `NIGHTWATCH_LOGIN_admin_PASSWORD=` and set it to your password
- Restart your containers (Ctrl + C and `docker-compose up`)
- Run `yarn workspace admin-ui nightwatch` in the node container

### Local Installation

#### Requirements

- PHP 5.5.9 or greater
- PHP's pdo_sqlite extension installed. You can use `php -m` to check.
- SQLite 3 CLI package
  * For Ubuntu users, `sudo apt install sqlite3`. You can use `sqlite3 --version` to check that the CLI is available.

#### Steps

```
composer create-project jsdrupal/drupal-admin-ui-demo -s dev --prefer-dist
cd drupal-admin-ui-demo
cp demo/templates/composer.json demo
cp demo/templates/composer.lock demo
cp demo/templates/.ht.router.php demo/docroot
composer setup
```

### Running
```
composer start
```

Try visiting one of the converted pages, e.g. the user permissions or roles page.

### Developing

- Ensure you have [Node 8](https://nodejs.org/en/) or greater and [Yarn](https://yarnpkg.com/) installed.
- Make sure the webserver for Drupal is started with `composer start`
- Run `composer devify`. You will now have a checkout of this repo in `drupal-admin-ui`.
It will also symlink the bundled production app to `docroot/vfancy`, and the support module to
`docroot/modules/contrib`.
- Edit `drupal-admin-ui/.env.local` and add in the URL for your currently running Drupal installation
that was output from the start command. e.g. for `Starting webserver on http://127.0.0.1:8888`, set
`REACT_APP_DRUPAL_BASE_URL=http://127.0.0.1:8888`
- Enter the repo with `cd drupal-admin-ui` and start the Webpack dev server with `yarn workspace admin-ui start`. This
will open a new window at `http://localhost:3000/`

The webpack dev server has hot reloading, however you won't be able to seamlessly switch between
Drupal and the React app. If you want to test out your changes in this context, enter the
`drupal-admin-ui` directory and run `yarn workspace admin-ui build`. You can then visit the URL that
`composer start` generated.

#### tl;dr
```
composer start

# New terminal window:
composer devify

# Add the URL generated from the start command:
vim drupal-admin-ui/.env.local
cd drupal-admin-ui
yarn workspace admin-ui start
```

### React AXE

Due to outstanding performance issues, `react-axe` is behind a flag. To enable the assessment provided by `react-axe`, pass an environment variable when starting the application.

```
REACT_APP_AXE=true yarn workspace admin-ui start
```

## Commands

See package.json for a full list

|`yarn workspace admin-ui <script>`|Description|
|------------------|-----------|
|`start`|Serves your app at `localhost:3000`.|
|`build`|Compiles the application for production into folder `./build`.|
|`test`|Runs all available tests.|
|`storybook`|Starts [Storybook](https://storybook.js.org/) UI dev environment


## Development guidelines

### Testing

We have functional testing with [Nightwatch](http://nightwatchjs.org/), and component/unit testing with [Jest](https://jestjs.io/).

When deciding which system to use to add test coverage, the general rule is Nightwatch should be used to test the common path, and Jest can be used for more detailed test coverage. Nightwatch tests will run slower as they simulate clicking around in a real browser.

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
- Alternatively, they could give you access to modify their branch directly at `https://github.com/<username>/drupal-admin-ui/settings/collaboration` (although bear in mind this will give access to their entire repository fork)
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
## Extension Points Bundler

See the documentation in `packages/extension-points` for how this tooling works.
