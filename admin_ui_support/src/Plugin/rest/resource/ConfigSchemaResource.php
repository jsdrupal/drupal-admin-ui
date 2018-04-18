<?php

namespace Drupal\admin_ui_support\Plugin\rest\resource;

use Drupal\Core\Config\TypedConfigManagerInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides a rest resource for config schema.
 *
 * @RestResource(
 *   id = "config_schema",
 *   label = @Translation("Config schema"),
 *   uri_paths = {
 *     "canonical" = "/admin-api/config-schema/{name}"
 *   }
 * )
 */
class ConfigSchemaResource extends ResourceBase {

  /**
   * @var \Drupal\Core\Config\TypedConfigManagerInterface
   */
  protected $typedConfigManager;

  /**
   * Constructs a Drupal\rest\Plugin\ResourceBase object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\Core\Config\TypedConfigManagerInterface $typedConfigManager
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, TypedConfigManagerInterface $typedConfigManager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition,
      $serializer_formats, $logger);

    $this->typedConfigManager = $typedConfigManager;
  }


  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('rest'),
      $container->get('config.typed')
    );
  }


  /**
   * Responds to GET requests.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The response containing a config schema
   */
  public function get($name) {
    if (!$this->typedConfigManager->hasDefinition($name)) {
      throw new NotFoundHttpException();
    }
    return new ResourceResponse($this->typedConfigManager->getDefinition($name));
  }

}
