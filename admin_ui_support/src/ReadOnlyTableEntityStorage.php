<?php

namespace Drupal\admin_ui_support;

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
}