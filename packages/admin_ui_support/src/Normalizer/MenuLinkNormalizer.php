<?php

namespace Drupal\admin_ui_support\Normalizer;

use Drupal\Core\Menu\MenuLinkInterface;
use Drupal\serialization\Normalizer\NormalizerBase;

class MenuLinkNormalizer extends NormalizerBase {

  /**
   * {@inheritdoc}
   */
  protected $supportedInterfaceOrClass = '\Drupal\Core\Menu\MenuLinkInterface';

  public function normalize($object, $format = NULL, array $context = array()) {
    if ($object instanceof MenuLinkInterface) {
      $menu_link = [
        'weight' => $object->getWeight(),
        'title' => (string) $object->getTitle(),
        'description' => (string) $object->getDescription(),
        'menuName' => (string) $object->getMenuName(),
        'url' => (string) $object->getUrlObject()->setOption('absolute', FALSE)->toString(TRUE)->getGeneratedUrl(),
      ];
      return $menu_link;
    }
  }

}
