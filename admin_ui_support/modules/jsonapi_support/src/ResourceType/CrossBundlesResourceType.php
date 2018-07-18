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
   */
  public function getBundle() {
    return NULL;
  }

}
