<?php

namespace Drupal\jsonapi_support\Controller;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\jsonapi\Controller\EntityResource as BaseEntityResource;
use Drupal\jsonapi\ResourceType\ResourceType;

class EntityResource extends BaseEntityResource {

  protected function getCollectionQuery(ResourceType $resource_type, array $params, CacheableMetadata $query_cacheability) {
    return;
  }

}
