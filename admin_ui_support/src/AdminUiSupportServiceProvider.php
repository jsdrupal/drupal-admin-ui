<?php

namespace Drupal\admin_ui_support;

use Drupal\admin_ui_support\Controller\JsonApiRequestHandler;
use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

/**
 * Alters Jsonapi service to override request handler.
 *
 * @see \Drupal\admin_ui_support\Controller\JsonApiRequestHandler
 */
class AdminUiSupportServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    if ($container->has('jsonapi.request_handler')) {
      // Override the class used for Jsonapi request handler.
      $definition = $container->getDefinition('jsonapi.request_handler');
      $definition->setClass(JsonApiRequestHandler::class);
    }
  }

}
