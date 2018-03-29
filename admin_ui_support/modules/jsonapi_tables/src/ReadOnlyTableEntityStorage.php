<?php

namespace Drupal\jsonapi_tables;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Sql\SqlContentEntityStorage;

/**
 * SQL Entity storage for entity types that wrap readonly tables.
 */
class ReadOnlyTableEntityStorage extends SqlContentEntityStorage {

  /**
   * {@inheritdoc}
   *
   * Don't trigger deletion of table.
   */
  public function onEntityTypeDelete(EntityTypeInterface $entity_type) {
  }

  /**
   * {@inheritdoc}
   *
   * The entity type does not control its own data.
   * This prevents the module from not being able to be deleted.
   */
  public function hasData() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function save(EntityInterface $entity) {
    throw new \LogicException('Saving not allow on read-only entity type: ' . $entity->getEntityTypeId());
  }

}