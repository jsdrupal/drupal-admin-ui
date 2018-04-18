<?php

namespace Drupal\admin_ui_support_schemata;

use Drupal\admin_ui_support_schemata\Schema\SimpleConfigSchema;
use Drupal\Core\Url;

class SimpleConfigSchemaUrl {

    /**
   * Generate a URI for the Schema instance.
   *
   * @param string $format
   *   The format or type of schema.
   * @param string $describes
   *   The format being described.
   * @param \Drupal\admin_ui_support_schemata\Schema\SimpleConfigSchema $schema
   *   The schema for which we generate the link.
   *
   * @return \Drupal\Core\Url
   *   The schema resource Url object.
   */
  public static function fromSchema($format, $describes, SimpleConfigSchema $schema) {
    return static::fromOptions(
      $format,
      $describes,
      $schema->getName()
    );
  }

  /**
   * Build a URI to a schema resource.
   *
   * @param string $format
   *   The format or type of schema.
   * @param string $describes
   *   The format being described.
   *
   * @return \Drupal\Core\Url
   *   The schema resource Url object.
   */
  public static function fromOptions($format, $describes, $simple_config_name) {
    $route_name = sprintf('schemata.config.%s', str_replace('.', '__', $simple_config_name));

    return Url::fromRoute($route_name, [], [
      'query' => [
        '_format' => $format,
        '_describes' => $describes,
      ],
      'absolute' => TRUE,
    ]);
  }

}
