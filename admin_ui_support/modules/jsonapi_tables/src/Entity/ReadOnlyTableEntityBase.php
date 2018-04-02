<?php

namespace Drupal\jsonapi_tables\Entity;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\jsonapi_tables\EntityTypeTableSchemaTrait;

/**
 * Base entity type class for read-only table entity types.
 *
 * Extend this class to expose a specific table to jsonapi. If no special field
 * handling is needed then class will only need the annotation.
 */
abstract class ReadOnlyTableEntityBase extends ContentEntityBase {

  use EntityTypeTableSchemaTrait;

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);
    foreach (self::getEntityTypeSchemaFields($entity_type) as $field_name => $field) {
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

  /**
   * {@inheritdoc}
   */
  public static function postLoad(EntityStorageInterface $storage, array &$entities) {
    parent::postLoad($storage, $entities);
    $schema_fields = [];
    /** @var \Drupal\Core\Entity\EntityInterface $entity */
    foreach ($entities as $entity) {
      if (!$schema_fields) {
        $schema_fields = self::getEntityTypeSchemaFields($entity->getEntityType());
      }
      foreach ($entity as $field_name => $field) {
        if (isset($schema_fields[$field_name])) {
          if (self::isSerializedField($entity->getEntityType(), $field_name)) {
            self::jsonSerializeBlogField($entity, $field_name);
          }
        }
      }
    }
    return $entities;
  }

  /**
   * Json serializes the value of blob field.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity.
   * @param string $field_name
   *   The blob field name.
   */
  protected static function jsonSerializeBlogField(EntityInterface $entity, $field_name) {
    $value = $entity->get($field_name)[0]->getValue()['value'];
    $unserialized = unserialize($value);
    $json_serialized = Json::encode($unserialized);
    $entity->set($field_name, $json_serialized);
  }

  /**
   * {@inheritdoc}
   */
  public function uuid() {
    if (!isset(static::getEntityTypeSchemaFields($this->getEntityType())['fields']['uuid'])) {
      // @todo Can we add uuid to tables to remove this hack?
      return $this->id();
    }
    return parent::uuid();
  }

}
