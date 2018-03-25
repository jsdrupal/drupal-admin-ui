<?php

namespace Drupal\admin_ui_support\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Drupal\Core\Routing\RoutingEvents;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    $take_over_routes = [];
    $call_back_routes = [];
    // Find all additional routes that this module should take over by checking
    // the '_admin_related_route' route option.
    foreach ($collection->getIterator() as $override_route_name => $route) {
      if ($overridden_route_name = $route->getOption('_admin_related_route')) {
        $related_route = $collection->get($overridden_route_name);
        // Take over this route.
        $take_over_routes[] = [$overridden_route_name, $override_route_name];
        // Keep all the same requirements as the related route.
        // The React callbacks should have the same permissions as the related
        // route.
        $route->setRequirements($related_route->getRequirements());
        // The format for the React callback is always json.
        // @todo should callbacks be REST resources?
        $route->setRequirement('_format', 'json');
      }
    }
    foreach ($take_over_routes as [$overridden_route_name, $override_route_name]) {
      $route = $collection->get($overridden_route_name);
      $route->setDefault('_origin', $route->getDefaults());
      $route->setDefault('_override_route_name', $override_route_name);
      $route->setDefault('_controller', 'Drupal\admin_ui_support\Controller\DefaultController::getAppRoute');
      $route->setOption('_drupal_admin_ui.route', TRUE);
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
