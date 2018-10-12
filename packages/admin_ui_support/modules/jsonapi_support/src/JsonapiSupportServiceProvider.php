<?php

namespace Drupal\jsonapi_support;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;
use Drupal\jsonapi_support\Controller\JsonApiRequestHandler;
use Drupal\jsonapi_support\ResourceType\ResourceTypeRepository;

/**
 * Alters Jsonapi service to override the resource type repository.
 *
 * @see \Drupal\admin_ui_support\Controller\JsonApiRequestHandler
 */
class JsonapiSupportServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    if ($container->has('jsonapi.resource_type.repository')) {
      // Override the class used for Jsonapi request repository.
      $definition = $container->getDefinition('jsonapi.resource_type.repository');
      $definition->setClass(ResourceTypeRepository::class);
    }

    if ($container->has('jsonapi.request_handler')) {
      // Override the class used for Jsonapi request handler.
      $definition = $container->getDefinition('jsonapi.request_handler');
      $definition->setClass(JsonApiRequestHandler::class);
    }
  }

}
