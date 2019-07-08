<?php

namespace Drupal\jsonapi_support\ResourceType;

use Drupal\jsonapi\ResourceType\ResourceTypeRepository as JsonApiResourceTypeRepository;

/**
 * Provides a repository of all JSON API resource types.
 *
 * Contains the complete set of ResourceType value objects, which are auto-
 * generated based on the Entity Type Manager and Entity Type Bundle Info: one
 * JSON API resource type per entity type bundle. So, for example:
 * - node--article
 * - node--page
 * - node--…
 * - user--user
 * - …
 *
 * @see \Drupal\jsonapi\ResourceType\ResourceType
 *
 * @internal
 */
class ResourceTypeRepository extends JsonApiResourceTypeRepository {

  /**
   * {@inheritdoc}
   */
  public function all() {
    $all = [];
    //if (!$this->all) {
      $resource_types = parent::all();
      $entity_types = $this->entityTypeManager->getDefinitions();
      foreach ($entity_types as $entity_type_id => $entity_type) {
        $resource_type = new CrossBundlesResourceType(
          $entity_type_id,
          $entity_type_id,
          $entity_type->getClass(),
          $entity_type->isInternal()
        );
        $relatable_resource_types = $this->calculateRelatableResourceTypes($resource_type,$resource_types);
        $resource_type->setRelatableResourceTypes($relatable_resource_types);
        $all[] = $resource_type;
      }
    //}
    return $all;
  }
}
