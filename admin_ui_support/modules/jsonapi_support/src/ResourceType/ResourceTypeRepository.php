<?php

namespace Drupal\jsonapi_support\ResourceType;

use Drupal\Core\Cache\Cache;
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
    $resource_types = parent::all();
    $resource_types_added = FALSE;
    // Determine if the CrossBundlesResourceType have already be added.
    foreach ($resource_types as $resource_type) {
      if ($resource_type instanceof CrossBundlesResourceType) {
        $resource_types_added = TRUE;
        break;
      }
    }
    if (!$resource_types_added) {
      $this->addResourceTypes($resource_types);
      $this->staticCache->set('jsonapi.resource_types', $resource_types, Cache::PERMANENT, ['jsonapi_resource_types']);
    }
    return $resource_types;
  }

  /**
   * {@inheritdoc}
   */
  public function get($entity_type_id, $bundle) {
    // Handle requests where the bundle is not provided.
    // @see \Drupal\jsonapi_support\ResourceType\CrossBundlesResourceType::getBundle()
    if (!empty($entity_type_id) && empty($bundle)) {
      foreach ($this->all() as $resource) {
        // Only handle CrossBundlesResourceType resources in this method.
        if ($resource instanceof CrossBundlesResourceType && $resource->getEntityTypeId() == $entity_type_id) {
          return $resource;
        }
      }
      return NULL;
    }
    // Let the parent class handle all other requests.
    return parent::get($entity_type_id, $bundle);
  }

  /**
   * Adds the CrossBundlesResourceType types to the list.
   *
   * @param \Drupal\jsonapi\ResourceType\ResourceType[] $resource_types
   *   A list of JSON API resource types.
   */
  private function addResourceTypes(array &$resource_types) {
    $entity_types = $this->entityTypeManager->getDefinitions();
    foreach ($entity_types as $entity_type_id => $entity_type) {
      $resource_type = new CrossBundlesResourceType(
        $entity_type_id,
        $entity_type_id,
        $entity_type->getClass(),
        $entity_type->isInternal(),
        TRUE,
        FALSE
      );
      $relatable_resource_types = $this->calculateRelatableResourceTypes($resource_type, $resource_types);
      if ($resource_type->getEntityTypeId() === 'taxonomy_term') {
        // Tags can only have parent of the same bundle so don't include this
        // relationship.
        unset($relatable_resource_types['parent']);
      }
      $resource_type->setRelatableResourceTypes($relatable_resource_types);
      $resource_types[] = $resource_type;
    }
  }

}
