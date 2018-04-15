<?php

namespace Drupal\admin_ui_support\Controller;

use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\jsonapi\Controller\EntityResource;
use Drupal\jsonapi\Controller\RequestHandler;
use Drupal\jsonapi\ResourceType\ResourceType;
use Symfony\Component\Routing\Route;

/**
 * Acts as intermediate request forwarder for resource plugins.
 *
 * Overrides Jsonapi's default handler to use ConfigEntityResource for config
 * entities.
 *
 * @internal
 */
class JsonApiRequestHandler extends RequestHandler {

  /**
   * {@inheritdoc}
   */
  protected function resourceFactory(ResourceType $resource_type) {
    $resource = new ConfigEntityResource(
      $resource_type,
      $this->entityTypeManager,
      $this->fieldManager,
      $this->fieldTypeManager,
      $this->linkManager,
      $this->resourceTypeRepository
    );
    return $resource;
  }

}
