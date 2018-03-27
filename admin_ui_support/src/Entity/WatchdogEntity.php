<?php

namespace Drupal\admin_ui_support\Entity;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Entity\ContentEntityBase;
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
      ->setDefaultValue(NULL);

    $fields['type'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Type'))
      ->setDescription(t('Type of log message, for example "user" or "page not found..'))
      // Set no default value.
      ->setDefaultValue(NULL);

    $fields['variables'] = BaseFieldDefinition::create('string')
      ->setLabel(t('variables'))
      ->setDescription(t('Serialized array of variables that match the message string and that is passed into the t() function..'))
      // Set no default value.
      ->setDefaultValue(NULL);

    $fields['severity'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('Location'))
      ->setDescription(t('The severity level of the event; ranges from 0 (Emergency) to 7 (Debug).'))
      // Set no default value.
      ->setDefaultValue(NULL);

    $fields['location'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Location'))
      ->setDescription(t('The location.'))
      // Set no default value.
      ->setDefaultValue(NULL);

    $fields['link'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Link'))
      ->setDescription(t('Link to view the result of the event.'))
      // Set no default value.
      ->setDefaultValue(NULL);

    $fields['referer'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Referer'))
      ->setDescription(t('URL of referring page.'))
      // Set no default value.
      ->setDefaultValue(NULL);

    $fields['message_formatted'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Referer'))
      ->setDescription(t('message_formatted.'))
      // Set no default value.
      ->setComputed(TRUE);

    $fields['hostname'] = BaseFieldDefinition::create('string')
      ->setLabel(t('hostname'))
      ->setDescription(t('Hostname of the user who triggered the event.'))
      // Set no default value.
      ->setDefaultValue(NULL);


    $fields['uid'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('User Name'))
      ->setDescription(t('The Name of the associated user.'))
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default');

    $fields['timestamp'] = BaseFieldDefinition::create('timestamp')
      ->setLabel(t('Timestamp'))
      ->setDescription(t('Timestamp'));


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