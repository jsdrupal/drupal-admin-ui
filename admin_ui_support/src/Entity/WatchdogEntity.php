<?php

namespace Drupal\admin_ui_support\Entity;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Defines the ContentEntityExample entity.
 *
 * @ingroup content_entity_example
 *
 * @ContentEntityType(
 *   id = "watchdog_entity",
 *   label = @Translation("Watchdog Entity"),
 *   table_provider = "dblog",
 *   handlers = {
 *     "storage" = "Drupal\admin_ui_support\WatchdogStorage",
 *     "access" = "Drupal\admin_ui_support\ReadOnlyAccessControlHandler",
 *   },
 *   base_table = "watchdog",
 *   entity_keys = {
 *     "id" = "wid",
 *     "label" = "message",
 *   },
 *   links = {
 *     "canonical" = "/{admin/reports/dblog/{watchdog_entity}",
 *     "collection" = "/admin/reports/dblog",
 *   },
 * )
 *
 */
class WatchdogEntity extends ReadOnlyTableEntityBase {

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['message_formatted'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Referer'))
      ->setDescription(t('message_formatted.'))
      // Set no default value.
      ->setComputed(TRUE);

    $fields['uid'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('User Name'))
      ->setDescription(t('The Name of the associated user.'))
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default');

    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public static function postLoad(EntityStorageInterface $storage, array &$entities) {
    parent::postLoad($storage, $entities);
    foreach ($entities as &$entity) {
      if (isset($entity->variables)) {
        $value = $entity->variables[0]->getValue()['value'];
        $variables = unserialize($value);
        $serialized = Json::encode($variables);
        $entity->set('variables', $serialized);
        $message =  $entity->message[0]->getValue()['value'];
        $entity->set('message_formatted', t($message, $variables));
      }
    }
    return $entities;
  }

  /**
   * {@inheritdoc}
   */
  public function uuid() {
    // @todo Can we add uuid to watchdog to remove this hack?
    return $this->id();
  }

}