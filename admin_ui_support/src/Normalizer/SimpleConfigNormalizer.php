<?php

namespace Drupal\admin_ui_support\Normalizer;

use Drupal\serialization\Normalizer\NormalizerBase;

class SimpleConfigNormalizer extends NormalizerBase {

  /**
   * {@inheritdoc}
   */
  protected $supportedInterfaceOrClass = '\Drupal\Core\Config\StorableConfigBase';

  /**
   * {@inheritdoc}
   */
  public function normalize($object, $format = NULL, array $context = array()) {
    /** @var \Drupal\Core\Config\StorableConfigBase $object */
    return $object->get();
  }

}
