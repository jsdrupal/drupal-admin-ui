<?php

namespace Drupal\admin_ui_support\Entity;

use Drupal\Core\Entity\ContentEntityBase;
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
 *   handlers = {
 *     "storage" = "Drupal\admin_ui_support\WatchdogStorage",
 *     "access" = "Drupal\admin_ui_support\WatchdogAccessControlHandler",
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
class WatchdogEntity extends ContentEntityBase {

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['message'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Message'))
      ->setDescription(t('The message.'))
      // Set no default value.
      ->setDefaultValue(NULL)
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);

    $fields['location'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Location'))
      ->setDescription(t('The location.'))
      // Set no default value.
      ->setDefaultValue(NULL)
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);


    $fields['uid'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('User Name'))
      ->setDescription(t('The Name of the associated user.'))
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);

    $fields['timestamp'] = BaseFieldDefinition::create('timestamp')
      ->setLabel(t('Timestamp'))
      ->setDescription(t('Timestamp'));


    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public function uuid() {
    // @todo Can we add uuid to watchdog to remove this hack?
    return $this->id();
  }

}