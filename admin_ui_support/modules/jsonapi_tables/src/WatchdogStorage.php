<?php

namespace Drupal\jsonapi_tables;

/**
 * The watchdog entity storage class.
 */
class WatchdogStorage extends ReadOnlyTableEntityStorage {

  /**
   * {@inheritdoc}
   */
  public function loadByProperties(array $values = []) {
    // @todo Can we add uuid to watchdog to remove this hack?
    if (isset($values['uuid'])) {
      $values['wid'] = $values['uuid'];
      unset($values['uuid']);
    }
    return parent::loadByProperties($values);
  }

}