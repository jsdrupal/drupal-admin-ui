<?php

namespace Drupal\admin_ui_support;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Sql\SqlContentEntityStorage;

class WatchdogStorage extends SqlContentEntityStorage {

  public function loadByProperties(array $values = []) {
    // @todo Can we add uuid to watchdog to remove this hack?
    if (isset($values['uuid'])) {
      $values['wid'] = $values['uuid'];
      unset($values['uuid']);
    }
    return parent::loadByProperties($values);
  }

  /**
   * {@inheritdoc}
   *
   * Don't trigger deletion of watchdog table.
   */
  public function onEntityTypeDelete(EntityTypeInterface $entity_type) {
  }

}