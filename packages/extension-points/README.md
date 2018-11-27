# @drupal/extension-points-bundler

Tooling to bundle and transpile your JavaScript to be used with the AdminUI.

## Installation

* Use `npm install --save-dev @drupal/extension-points-bundler` or `yarn add @drupal/extension-points-bundler`
to add it to your project. All the bundling and transpile dependencies and settings are included.

```
yarn add @drupal/extension-points-bundler

# Build
./node_modules/.bin/extension-points-bundler

# Build for production
./node_modules/.bin/extension-points-bundler --mode=production
```

## Documentation

This tooling looks for your `*.admin_ui.components.yml` file and parses it's contents to create entry points for Webpack.

This tooling assumes that your source JavaScript exists at `/js/src` and it's output will be `/js/build`.

The bundling process automatically externalizes `React` and `@material-ui/core`.

### Widgets Configuration

A single `*.admin_ui.components.yml` file can contain as many widgets as needed.

```
widgets:
  options_buttons:
    component: js/build/options_buttons.widget.js
    multiple: true
```

### Routes Configuration

A single `*.admin_ui.routes.yml` file can contain as many routes as needed. Note that route will be automatically prefixed with the Drupal module name. For example the route provided in `/examples/admin_ui_widget_example/admin_ui_widget_example.admin_ui.routes.yml` would result in the following route in the application, `/admin_ui_widget_example/test`.

```
routes:
  hello_world:
    route: '/test'
    component: js/build/hello_world.route.js
```
