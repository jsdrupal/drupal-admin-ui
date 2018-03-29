<?php

namespace Drupal\admin_ui_support\Plugin\Deriver;

use Drupal\Core\Config\Config;
use Drupal\Core\Config\ConfigBase;
use Drupal\Core\Config\ConfigNameException;
use Drupal\Core\Config\TypedConfigManagerInterface;
use Drupal\Core\Plugin\Discovery\ContainerDeriverInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Derives REST resources for all simple config objects.
 */
class SimpleConfigDeriver implements ContainerDeriverInterface {

  /**
   * List of derivative definitions.
   *
   * @var array
   */
  protected $derivatives;

  /**
   * The typed config manager.
   *
   * @var \Drupal\Core\Config\TypedConfigManagerInterface
   */
  protected $typedConfigManager;

  /**
   * SimpleConfigDeriver constructor.
   *
   * @param \Drupal\Core\Config\TypedConfigManagerInterface $typedConfigManager
   *   The typed config manager.
   */
  public function __construct(TypedConfigManagerInterface $typedConfigManager) {
    $this->typedConfigManager = $typedConfigManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, $base_plugin_id) {
    return new static(
      $container->get('config.typed')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getDerivativeDefinition($derivative_id, $base_plugin_definition) {
    if (!isset($this->derivatives)) {
      $this->getDerivativeDefinitions($base_plugin_definition);
    }
    if (isset($this->derivatives[$derivative_id])) {
      return $this->derivatives[$derivative_id];
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getDerivativeDefinitions($base_plugin_definition) {
    if (isset($this->derivatives)) {
      return $this->derivatives;
    }

    // Get all simple config and create plugin definition for them.
    $config_schemas = $this->typedConfigManager->getDefinitions();
    $simple_config_schemas = array_filter($config_schemas, function ($config_schema) use ($config_schemas) {
      return $this->isConfigSchema($config_schema, $config_schemas);
    });

    foreach ($simple_config_schemas as $name => $simple_config_schema) {
      // @todo Should we expose config with names that end in .*
      try {
        ConfigBase::validateName($name);
      }
      catch (ConfigNameException $exception) {
        continue;
      }
      $this->derivatives[str_replace('.', '_', $name)] = [
        'id' => 'config_' . str_replace('.', '_', $name),
        'config_name' => $name,
        // @todo Do we need a serialization class?
          // \Drupal\rest\RequestHandler::deserialize() might not give use a enough information. The data itself will not have the actual config id.
        //'serialization_class' => '@fixme',
        'label' => isset($simple_config_schema['label']) ? $simple_config_schema['label'] : 'Config: ' . $name,
        'uri_paths' => [
          'canonical' => "/config/$name",
          'create' => "/config/$name",
        ],
      ] + $base_plugin_definition;
    }
    return $this->derivatives;
  }

  /**
   * Determines if the schmema is a config schema.
   *
   * @param array $schema
   *   The schema to check.
   * @param array $all_schemas
   *   All schemas.
   *
   * @return bool
   *   True if the schema is a config schema otherwise false.
   */
  protected function isConfigSchema(array $schema, array $all_schemas) {
    if (empty($schema['type'])) {
      return FALSE;
    }
    if ($schema['type'] === 'config_object') {
      return TRUE;
    }
    elseif (isset($all_schemas[$schema['type']])) {
      return $this->isConfigSchema($all_schemas[$schema['type']], $all_schemas);
    }
    else {
      return FALSE;
    }
  }

}
