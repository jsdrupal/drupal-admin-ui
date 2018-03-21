<?php

namespace Drupal\admin_ui_support\Normalizer;

use Drupal\Core\Menu\MenuLinkTreeElement;
use Drupal\serialization\Normalizer\NormalizerBase;

class MenuTreeNormalizer extends NormalizerBase {

  /**
   * {@inheritdoc}
   */
  protected $supportedInterfaceOrClass = '\Drupal\Core\Menu\MenuLinkTreeElement';
  
  /**
   * {@inheritdoc}
   */
  public function normalize($object, $format = NULL, array $context = array()) {
    // Use proper accessiblity metadata.
    if ($object instanceof MenuLinkTreeElement && $object->access->isAllowed()) {
      $tree_element = [
        'subtree' => array_map([$this, 'normalize'], $object->subtree),
        'hasChildren' => $object->hasChildren,
        'inActiveTrail' => $object->inActiveTrail,
        'options' => $object->options,
        'link' => \Drupal::service('serializer')->normalize($object->link, $format, $context),
      ];
      return $tree_element;
    }
  }

}
