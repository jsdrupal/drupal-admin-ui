<?php

namespace Drupal\jsonapi_tables\Entity;

use Drupal\Component\Render\PlainTextOutput;
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
 *     "storage" = "Drupal\jsonapi_tables\ReadOnlyTableEntityStorage",
 *     "access" = "Drupal\jsonapi_tables\ReadOnlyAccessControlHandler",
 *   },
 *   base_table = "watchdog",
 *   entity_keys = {
 *     "id" = "wid",
 *     "label" = "message",
 *   },
 *   links = {
 *     "canonical" = "/admin/reports/dblog/{watchdog_entity}",
 *     "collection" = "/admin/reports/dblog",
 *   },
 *   admin_permission = "access site reports",
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
      ->setLabel(t('Formatted message'))
      ->setDescription(t('The formatted message.'))
      ->setComputed(TRUE);

    $fields['message_formatted_plain'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Formatted message plain'))
      ->setDescription(t('The formatted message stripped of HTML.'))
      ->setComputed(TRUE);

    // @todo Move the list of entity reference fields to annotation to be
    //   handled by base class.
    // @see \Drupal\jsonapi_tables\Entity\ReadOnlyTableEntityBase::baseFieldDefinitions
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
        // Format the message of a watchdog entry.
        $variables = $entity->variables[0]->getValue()['value'];
        $variables = Json::decode($variables);
        $message = t($entity->message[0]->getValue()['value'], $variables);
        $entity->set('message_formatted', $message);
        $entity->set('message_formatted_plain', PlainTextOutput::renderFromHtml($message));
      }
    }
    return $entities;
  }

}
