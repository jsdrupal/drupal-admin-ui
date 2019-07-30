<?php

namespace Drupal\jsonapi_support\ResourceType;


use Drupal\jsonapi\ResourceType\ResourceType;

/**
 * Resource type that allows collections for all bundles in an entity type.
 */
class CrossBundlesResourceType extends ResourceType {

  /**
   * {@inheritdoc}
   */
  public function getPath() {
    return $this->entityTypeId;
  }

  /**
   * {@inheritdoc}
   *
   * 
   */
  public function getInternalName($field_name) {
    if ($this->entityTypeId === 'node' && $field_name === 'bundle') {
      return 'type';
    }
    return parent::getInternalName($field_name);
  }

  /**
   * {@inheritdoc}
   */
  public function getBundle() {
    return NULL;
  }

}
