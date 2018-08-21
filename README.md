# Drupal Admin UI

This is an admin UI for Drupal, built with JavaScript and based on [create-react-app](https://github.com/facebook/create-react-app).

![Demo of vfancy falling back to Drupal for an unknown route](https://i.imgur.com/JW7CdkZ.gifv)

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
composer setup
```

## Running
```
composer start
```

Try visiting one of the converted pages, e.g. the user permissions or roles page.

## Developing

- Ensure you have [Node 8](https://nodejs.org/en/) or greater and [Yarn](https://yarnpkg.com/) installed.
- Make sure the webserver for Drupal is started with `composer start`
- Run `composer devify`. You will now have a checkout of this repo in `drupal-admin-ui`.
It will also symlink the bundled production app to `docroot/vfancy`, and the support module to
`docroot/modules/contrib`.
- Edit `drupal-admin-ui/.env.local` and add in the URL for your currently running Drupal installation
that was output from the start command. e.g. for `Starting webserver on http://127.0.0.1:8888`, set
`REACT_APP_DRUPAL_BASE_URL=http://127.0.0.1:8888`
- Enter the repo with `cd drupal-admin-ui` and start the Webpack dev server with `yarn start`. This
will open a new window at `http://localhost:3000/`

The webpack dev server has hot reloading, however you won't be able to seamlessly switch between
Drupal and the React app. If you want to test out your changes in this context, enter the
`drupal-admin-ui` directory and run `yarn build`. You can then visit the URL that
`composer start` generated.

### tl;dr
```
composer start

# New terminal window:
composer devify

# Add the URL generated from the start command:
vim drupal-admin-ui/.env.local
cd drupal-admin-ui
yarn start
```

### React AXE

Due to outstanding performance issues, `react-axe` is behind a flag. To enable the assessment provided by `react-axe`, pass an environment variable when starting the application.

```
REACT_APP_AXE=true yarn start
```

## Commands

See package.json for a full list

|`yarn <script>`|Description|
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
  
