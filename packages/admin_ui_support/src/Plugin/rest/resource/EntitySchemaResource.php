<?php

namespace Drupal\admin_ui_support\Plugin\rest\resource;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\schemata\SchemaFactory;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "entity_schema_resource",
 *   label = @Translation("Entity schema resource"),
 *   uri_paths = {
 *     "canonical" = "/admin-api/entity-schema/{entity_type}/{entity}"
 *   }
 * )
 */
class EntitySchemaResource extends ResourceBase {

  /**
   * The schemata factory.
   *
   * @var \Drupal\schemata\SchemaFactory
   */
  protected $schemaFactor;

  /**
   * Constructs a new EntitySchemaResource object.
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
   * @param \Drupal\Core\Session\AccountProxyInterface $current_user
   *   A current user instance.
   * @param \Drupal\schemata\SchemaFactory $schema_factory
   *   The schemata factory.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, AccountProxyInterface $current_user, SchemaFactory $schema_factory) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->schemaFactor = $schema_factory;
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
      $container->get('logger.factory')->get('admin_ui_support'),
      $container->get('current_user'),
      $container->get('schemata.schema_factory')
    );
  }

  /**
   * Responds to GET requests.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity object.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The HTTP response object.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function get(EntityInterface $entity) {
    $bundle = NULL;
    $entity_type = $entity->getEntityType();
    if ($entity_type->getBundleEntityType()) {
      $bundle = $entity->bundle();
    }
    $schema = $this->schemaFactor->create($entity->getEntityTypeId(), $bundle);
    /** @var \Symfony\Component\Serializer\SerializerInterface $serializer */
    /** @var \Normalizer $serializer */
    $serializer = \Drupal::service('serializer');
    $normalized = $serializer->normalize($schema, 'schema_json:api_json');
    return new ResourceResponse($normalized, 200);
  }

  /**
   * {@inheritdoc}
   */
  protected function getBaseRoute($canonical_path, $method) {
    $route = parent::getBaseRoute($canonical_path, $method);
    $route->setOption('parameters', [
      'entity' => [
        'type' => 'entity:{entity_type}',
      ],
    ]);
    return $route;
  }

}
