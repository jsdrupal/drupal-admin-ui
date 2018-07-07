<?php

namespace Drupal\admin_ui_support\Routing;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Routing\RouteSubscriberBase;
use Drupal\Core\Routing\RoutingEvents;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * RouteSubscriber constructor.
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    if (!$this->configFactory->get('admin_ui_support.settings')->get('redirect_related_routes')) {
      return;
    }
    // Find all additional routes that this module should take over by checking
    // the '_admin_related_route' route option.
    foreach ($collection->getIterator() as $override_route_name => $route) {
      if ($overridden_route_name = $route->getOption('_admin_related_route')) {
        if ($overridden_route = $collection->get($overridden_route_name)) {
          $overridden_route->setDefault('_controller', 'Drupal\admin_ui_support\Controller\DefaultController::getAppRoute');
        }
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
