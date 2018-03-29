<?php

namespace Drupal\jsonapi_tables;

use Drupal\Core\Entity\EntityTypeInterface;

trait EntityTypeTableSchemaTrait {
  /**
   * Gets the schema fields for the table of entity type.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type.
   *
   * @return array
   *   The array of schema fields.
   */
  protected static function getEntityTypeSchemaFields(EntityTypeInterface $entity_type) {
    $schema = self::getEntityTypeSchema($entity_type);
    return $schema['fields'];
  }

  /**
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type.
   *
   * @return array
   *   The schema.
   */
  protected static function getEntityTypeSchema(EntityTypeInterface $entity_type) {
    return drupal_get_module_schema($entity_type->get('table_provider'), $entity_type->getBaseTable());
  }

  /**
   * Gets the primary key for the table of entity type.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type.
   *
   * @return string
   *   The primary key field.
   */
  protected static function getEntityTypeSchemaPrimaryIndexField(EntityTypeInterface $entity_type) {
    $schema = static::getEntityTypeSchema($entity_type);
    if (isset($schema['primary key']) && count($schema['primary key']) === 1) {
      return $schema['primary key'][0];
    }
  }
}