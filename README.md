# Problem

How can modules register routes, so we don't have to hardcode the paths into the UI.
* Example: Contrib module adds a new route
* Example : Optional contrib module adds a new route

## Idea

Introduce a StaticRoutesRegistry module which you can add routes to.
Modules should then load their JS files before the drupal admin UI one
and register routes as needed.

## API

```
import Registry from '../StaticRoutesRegistry';

Registry.addRoute('/foo', {}, MyComponent);
```

As long we call this code before the router is build, we have the routes available.
