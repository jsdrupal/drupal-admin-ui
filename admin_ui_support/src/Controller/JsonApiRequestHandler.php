<?php

namespace Drupal\admin_ui_support\Controller;

use Drupal\Core\Config\Entity\ConfigEntityInterface;
use Drupal\jsonapi\Controller\RequestHandler;
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
  protected function resourceFactory(Route $route) {
    $entity_type_id = $route->getRequirement('_entity_type');
    $entity_type = $this->entityTypeManager->getDefinition($entity_type_id);
    if ($entity_type->entityClassImplements(ConfigEntityInterface::class)) {
      return new ConfigEntityResource(
        $this->resourceTypeRepository->get($route->getRequirement('_entity_type'), $route->getRequirement('_bundle')),
        $this->entityTypeManager,
        $this->fieldManager,
        $this->currentContext,
        $this->fieldTypeManager,
        $this->linkManager,
        $this->resourceTypeRepository
      );
    }
    // If the entity is not a config entity default to the parent.
    return parent::resourceFactory($route);
  }

}
