<?php

namespace Drupal\jsonapi_support\Controller;

use Drupal\jsonapi\Controller\EntityResource;
use Drupal\jsonapi\Query\Filter;
use Drupal\jsonapi\Query\OffsetPage;
use Drupal\jsonapi\Query\Sort;

/**
 * Cross Bundle entity resource.
 */
class CrossBundleEntityResource extends EntityResource {

  /**
   * {@inheritdoc}
   */
  protected function getCollectionQuery($entity_type_id, array $params) {
    $entity_storage = $this->entityTypeManager->getStorage($entity_type_id);

    $query = $entity_storage->getQuery();

    // Ensure that access checking is performed on the query.
    $query->accessCheck(TRUE);

    // Compute and apply an entity query condition from the filter parameter.
    if (isset($params[Filter::KEY_NAME]) && $filter = $params[Filter::KEY_NAME]) {
      $query->condition($filter->queryCondition($query));
    }

    // Apply any sorts to the entity query.
    if (isset($params[Sort::KEY_NAME]) && $sort = $params[Sort::KEY_NAME]) {
      foreach ($sort->fields() as $field) {
        $path = $field[Sort::PATH_KEY];
        $direction = isset($field[Sort::DIRECTION_KEY]) ? $field[Sort::DIRECTION_KEY] : 'ASC';
        $langcode = isset($field[Sort::LANGUAGE_KEY]) ? $field[Sort::LANGUAGE_KEY] : NULL;
        $query->sort($path, $direction, $langcode);
      }
    }

    // Apply any pagination options to the query.
    if (isset($params[OffsetPage::KEY_NAME])) {
      $pagination = $params[OffsetPage::KEY_NAME];
    }
    else {
      $pagination = new OffsetPage(OffsetPage::DEFAULT_OFFSET, OffsetPage::SIZE_MAX);
    }
    // Add one extra element to the page to see if there are more pages needed.
    $query->range($pagination->getOffset(), $pagination->getSize() + 1);
    $query->addMetaData('pager_size', (int) $pagination->getSize());

    return $query;
  }

}
