<?php

namespace Drupal\jsonapi_support\ResourceType;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Config\Entity\ConfigEntityTypeInterface;
use Drupal\Core\Entity\ContentEntityTypeInterface;
use Drupal\Core\Entity\EntityTypeInterface;
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
      $raw_fields = $this->getAllFieldNamesAcrossBundles($entity_type);

      $resource_type = new CrossBundlesResourceType(
        $entity_type_id,
        $entity_type_id,
        $entity_type->getClass(),
        $entity_type->isInternal(),
        TRUE,
        FALSE,
        FALSE,
        static::getFieldMapping($raw_fields, $entity_type, $entity_type)
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

  /**
   * Gets all field names for a given entity type and bundle.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type for which to get all field names.
   *
   * @return string[]
   *   All field names.
   */
  private function getAllFieldNamesAcrossBundles(EntityTypeInterface $entity_type) {
    if ($entity_type instanceof ContentEntityTypeInterface) {
      $field_definitions = $this->entityFieldManager->getFieldStorageDefinitions($entity_type->id());
      return array_keys($field_definitions);
    }
    elseif ($entity_type instanceof ConfigEntityTypeInterface) {
      // @todo Uncomment the first line, remove everything else once https://www.drupal.org/project/drupal/issues/2483407 lands.
      // return array_keys($entity_type->getPropertiesToExport());
      $export_properties = $entity_type->getPropertiesToExport();
      if ($export_properties !== NULL) {
        return array_keys($export_properties);
      }
      else {
        return ['id', 'type', 'uuid', '_core'];
      }
    }
    else {
      throw new \LogicException("Only content and config entity types are supported.");
    }
  }

}
