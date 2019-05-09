<?php

namespace Drupal\jsonapi_support;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;
use Drupal\jsonapi_support\Controller\EntityResource;
use Drupal\jsonapi_support\ResourceType\ResourceTypeRepository;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Reference;

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

    if ($container->has('jsonapi.entity_resource')) {
      $container->register('jsonapi_support.entity_resource', EntityResource::class)
        ->setDecoratedService('jsonapi.entity_resource', 'jsonapi.entity_resource.inner')
        ->addArgument(new Reference('jsonapi.entity_resource.inner'));
    }
  }

}
