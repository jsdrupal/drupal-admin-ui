<?php

namespace Drupal\jsonapi_support\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Drupal\Core\Routing\RoutingEvents;
use Drupal\jsonapi_support\ResourceType\CrossBundlesResourceType;
use Symfony\Component\Routing\RouteCollection;

/**
 * Ensures that the /entity_type resource just supports collection GET requests.
 *
 * @internal
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    /** @var \Drupal\jsonapi_support\ResourceType\ResourceTypeRepository $type_repository */
    $type_repository = \Drupal::service('jsonapi.resource_type.repository');
    // Remove all non-collection routes for Cross Bundle resources.
    $remove_routes = [];
    foreach ($collection->getIterator() as $route_name => $route) {
      if ($route->getDefault('_is_jsonapi')) {
        $name_parts = explode('.', $route_name);
        $resource_key = $name_parts[1];
        $resource = $type_repository->getByTypeName($resource_key);
        if (!isset($name_parts[2])) {
          continue;
        }
        $route_method = $name_parts[2];
        if ($resource instanceof CrossBundlesResourceType) {
          if ($route_method !== 'collection') {
            $remove_routes[] = $route_name;
          }
          else {
            $route->setMethods(['GET']);
          }
        }
      }
    }
    foreach ($remove_routes as $remove_route) {
      $collection->remove($remove_route);
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    // Come after field_ui.
    $events[RoutingEvents::ALTER] = ['onAlterRoutes', -500];
    return $events;
  }

}
