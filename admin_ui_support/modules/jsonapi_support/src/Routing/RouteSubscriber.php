<?php

namespace Drupal\jsonapi_support\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Drupal\Core\Routing\RoutingEvents;
use Drupal\jsonapi_support\ResourceType\CrossBundlesResourceType;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
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
      if ($route->getOption('_is_jsonapi')) {
        $name_parts = explode('.', $route_name);
        $resource_key = $name_parts[1];
        $resource = $type_repository->getByTypeName($resource_key);
        $route_method = $name_parts[2];
        if ($resource instanceof CrossBundlesResourceType && $route_method !== 'collection') {
          $remove_routes[] = $route_name;
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
