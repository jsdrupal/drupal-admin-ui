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
    // Find all additional routes that this module should take over by checking
    // the '_admin_related_route' route option.
    foreach ($collection->getIterator() as $override_route_name => $route) {
      if ($overridden_route_name = $route->getOption('_admin_related_route')) {
        $overridden_route = $collection->get($overridden_route_name);

        $overridden_route->setDefault('_controller', 'Drupal\admin_ui_support\Controller\DefaultController::getAppRoute');
      }
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
