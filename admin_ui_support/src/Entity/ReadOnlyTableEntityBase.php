<?php

namespace Drupal\admin_ui_support\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Base entity type class for read-only table entity types.
 */
abstract class ReadOnlyTableEntityBase extends ContentEntityBase {

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);
    $schema = drupal_get_module_schema($entity_type->get('table_provider'), $entity_type->getBaseTable());
    foreach ($schema['fields'] as $field_name => $field) {
      if (!isset($fields[$field_name])) {
        if ($base_field_type = static::getBaseFieldType($field)) {
          $fields[$field_name] = BaseFieldDefinition::create($base_field_type)
            ->setLabel($field_name)
            ->setDescription($field['description'])
            ->setReadOnly(TRUE);
        }
      }
    }
    return $fields;
  }

  /**
   * Gets the base field type for a schema field.
   *
   * @param array $field
   *   The schema field.
   *
   * @return string|null
   *   The type of base field if any.
   */
  protected static function getBaseFieldType(array $field) {
    $types = [
      'int' => 'integer',
      'string' => 'string',
      'text' => 'string',
      'timestamp' => 'timestamp',
      'varchar_ascii' => 'string',
      'blob' => 'string',
    ];
    if (isset($types[$field['type']])) {
      return $types[$field['type']];
    }
    return NULL;
  }

}