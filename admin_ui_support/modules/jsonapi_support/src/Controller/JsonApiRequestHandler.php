<?php

namespace Drupal\jsonapi_support\Controller;

use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\jsonapi\Controller\EntityResource;
use Drupal\jsonapi\Controller\RequestHandler;
use Drupal\jsonapi\ResourceType\ResourceType;
use Drupal\jsonapi_support\ResourceType\CrossBundlesResourceType;
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
    $entity_type = $this->entityTypeManager->getDefinition($resource_type->getEntityTypeId());
    if ($entity_type->entityClassImplements(ConfigEntityInterface::class)) {
      return new ConfigEntityResource(
        $resource_type,
        $this->entityTypeManager,
        $this->fieldManager,
        $this->fieldTypeManager,
        $this->linkManager,
        $this->resourceTypeRepository
      );
    }
    if ($resource_type instanceof CrossBundlesResourceType) {
      return new CrossBundleEntityResource(
        $resource_type,
        $this->entityTypeManager,
        $this->fieldManager,
        $this->fieldTypeManager,
        $this->linkManager,
        $this->resourceTypeRepository
      );
    }
    return parent::resourceFactory($resource_type);
  }

}
