<?php

namespace Drupal\jsonapi_tables;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Sql\SqlContentEntityStorage;

/**
 * SQL Entity storage for entity types that wrap readonly tables.
 */
class ReadOnlyTableEntityStorage extends SqlContentEntityStorage {

  use EntityTypeTableSchemaTrait;
  /**
   * {@inheritdoc}
   */
  public function loadByProperties(array $values = []) {
    // @todo Can we add uuid to tabls to remove this hack?
    if (isset($values['uuid'])) {
      if ($field_name = static::getEntityTypeSchemaPrimaryIndexField($this->entityType)) {
        $values[$field_name] = $values['uuid'];
        unset($values['uuid']);
      }
      else {
        throw new \Exception('Unable to determine primary index field for entity type: ' . $this->entityTypeId);
      }
    }
    return parent::loadByProperties($values);
  }

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

  /**
   * {@inheritdoc}
   */
  public function delete(array $entities) {
    throw new \LogicException('Deleting not allow on read-only entity type');
  }

}
