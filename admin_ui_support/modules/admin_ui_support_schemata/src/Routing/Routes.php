<?php

namespace Drupal\admin_ui_support_schemata\Routing;

use Drupal\Core\Config\TypedConfigManagerInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Cmf\Component\Routing\RouteObjectInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class Routes implements ContainerInjectionInterface {

  /**
   * The front controller for the JSON API routes.
   *
   * All routes will use this callback to bootstrap the JSON API process.
   *
   * @var string
   */
  const CONTROLLER = '\Drupal\admin_ui_support_schemata\Controller\Controller::serializeSimpleConfig';

  /**
   * @var \Drupal\Core\Config\TypedConfigManagerInterface
   */
  protected $typedConfigManager;

  /**
   * Routes constructor.
   * @param \Drupal\Core\Config\TypedConfigManagerInterface $typedConfigManager
   */
  public function __construct(TypedConfigManagerInterface $typedConfigManager) {
    $this->typedConfigManager = $typedConfigManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.typed')
    );
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
    else if (isset($all_schemas[$schema['type']])) {
      return $this->isConfigSchema($all_schemas[$schema['type']], $all_schemas);
    }
    else {
      return FALSE;
    }
  }

  public function routes() {
    // Expose one route per simple config.
    
     // Get all simple config and create plugin definition for them.
    $config_schemas = $this->typedConfigManager->getDefinitions();
    $simple_config_schemas = array_filter($config_schemas, function ($config_schema) use ($config_schemas) {
      return $this->isConfigSchema($config_schema, $config_schemas);
    });

    $route_collection = new RouteCollection();
    // Loop through all the entity types.
    foreach ($simple_config_schemas as $simple_config_name => $simple_config_schema) {
      $route_collection->add($this->createRouteName($simple_config_name), $this->createRoute($simple_config_name));
    }

    return $route_collection;
  }

  protected function createRoute($simple_config_name) {
    $path = $this->getRoutePath($simple_config_name);
    $route = new Route($path);
    $route->setRequirement('_permission', 'access schemata data models');
    $route->setMethods(['GET']);
    $defaults = [
      'simple_config_name' => $simple_config_name,
      RouteObjectInterface::CONTROLLER_NAME => static::CONTROLLER,
    ];
    $route->setDefaults($defaults);
    return $route;
  }


  
  /**
   * Creates a route name for a entity type and bundle.
   *
   * @return string
   *   The route name.
   */
  protected function createRouteName($simple_config_name) {
    return sprintf('schemata.config.%s', str_replace('.', '__', $simple_config_name));
  }

  /**
   * Creates a route path for a entity type and bundle.
   *
   * @return string
   *   The route path.
   */
  protected function getRoutePath($simple_config_name) {
    return sprintf('/schemata/config/%s', $simple_config_name);
  }

}
