<?php

namespace Drupal\admin_ui_support\Plugin\rest\resource;

use Drupal\Component\Plugin\DependentPluginInterface;
use Drupal\Component\Plugin\PluginManagerInterface;
use Drupal\Core\Config\Config;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Represents simple config as resources.
 *
 * @see \Drupal\admin_ui_support\Plugin\Deriver\SimpleConfigDeriver
 *
 * @RestResource(
 *   id = "simple_config",
 *   label = @Translation("Simple config"),
 *   deriver = "\Drupal\admin_ui_support\Plugin\Deriver\SimpleConfigDeriver",
 *   uri_paths = {
 *     "canonical" = "/config/{config_name}/{simple_config}",
 *   }
 * )
 */
class SimpleConfigResource extends ResourceBase implements DependentPluginInterface {

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The link relation type manager used to create HTTP header links.
   *
   * @var \Drupal\Component\Plugin\PluginManagerInterface
   */
  protected $linkRelationTypeManager;

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * Constructs a Drupal\rest\Plugin\rest\resource\EntityResource object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   * @param \Drupal\Component\Plugin\PluginManagerInterface $link_relation_type_manager
   *   The link relation type manager.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager, array $serializer_formats, LoggerInterface $logger, ConfigFactoryInterface $config_factory, PluginManagerInterface $link_relation_type_manager, ModuleHandlerInterface $module_handler) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->configFactory = $config_factory;
    $this->linkRelationTypeManager = $link_relation_type_manager;
    $this->moduleHandler = $module_handler;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('rest'),
      $container->get('config.factory'),
      $container->get('plugin.manager.link_relation_type'),
      $container->get('module_handler')
    );
  }

  /**
   * Responds to entity GET requests.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The response containing the entity with its accessible fields.
   */
  public function get() {
    // @todo Access checking as part of https://www.drupal.org/project/drupal/issues/2949888
    $name = $this->getPluginDefinition()['config_name'];
    $config = $this->configFactory->get($name);
    $this->handleNewConfig($config);
    $response = new ResourceResponse($config, 200);
    $response->addCacheableDependency($config);

    return $response;
  }

  /**
   * Responds to PATCH requests.
   *
   * @param array $data
   *   The unserialized data.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The modified resource response.
   */
  public function patch(array $data) {
    $config = $this->configFactory->getEditable($this->getPluginDefinition()['config_name']);
    $this->handleNewConfig($config);
    $config->setData($data);
    $config->save();
    return new ModifiedResourceResponse($config);
  }

  /**
   * {@inheritdoc}
   */
  public function permissionsTest() {
    // @todo how to implement this?
    // @see https://www.drupal.org/node/2664780
    if ($this->configFactory->get('rest.settings')->get('bc_entity_resource_permissions')) {
      // The default Drupal 8.0.x and 8.1.x behavior.
      return parent::permissionsTest();
    }
    return parent::permissionsTest();
  }

  /**
   * {@inheritdoc}
   */
  protected function getBaseRoute($canonical_path, $method) {
    $route = parent::getBaseRoute($canonical_path, $method);
    $definition = $this->getPluginDefinition();

    $parameters = $route->getOption('parameters') ?: [];
    // @todo Add a config param converter?
    $parameters['simple_config']['simple_config'] = $definition['config_name'];
    $route->setOption('parameters', $parameters);

    return $route;
  }

  /**
   * {@inheritdoc}
   */
  public function availableMethods() {
    return ['GET', 'PATCH'];
  }

  /**
   * {@inheritdoc}
   */
  public function calculateDependencies() {
    // @todo Is there a better way to determine the module that provides the
    // config?
    $module_name = explode('.', $this->getPluginDefinition()['config_name'])[0];
    if ($this->moduleHandler->moduleExists($module_name)) {
      return ['module' => [$module_name]];
    }
    return [];
  }

  /**
   * Handles new config expception for GET and PATCH requests.
   *
   * @param \Drupal\Core\Config\Config $config
   *   The config object.
   */
  protected function handleNewConfig(Config $config) {
    if ($config->isNew()) {
      throw new NotFoundHttpException('This configuration object has not been created yet.');
    }
  }

}
