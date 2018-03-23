<?php

namespace Drupal\admin_ui_support\Plugin\rest\resource;

use Drupal\Component\Render\PlainTextOutput;
use Drupal\Core\Extension\ExtensionList;
use Drupal\Core\Extension\ModuleExtensionList;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Render\RenderContext;
use Drupal\Core\Render\RendererInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\user\PermissionHandlerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a rest resource for listing available permissions.
 *
 * @RestResource(
 *   id = "permissions_collection",
 *   label = @Translation("Available permissions"),
 *   uri_paths = {
 *     "canonical" = "/admin-api/permissions"
 *   }
 * )
 */
class PermissionsCollectionResource extends ResourceBase {

  /**
   * The permission handler.
   *
   * @var \Drupal\user\PermissionHandlerInterface
   */
  protected $permissionHandler;

  /**
   * The renderer.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * The module extension list.
   *
   * @var \Drupal\Core\Extension\ExtensionList
   */
  protected $moduleExtensionList;

  /**
   * Constructs a PermissionResource object.
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
   * @param \Drupal\user\PermissionHandlerInterface $permission_handler
   *   The permission handler
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer.
   * @param \Drupal\Core\Extension\ExtensionList $module_extension_list
   *   The module extension list.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, PermissionHandlerInterface $permission_handler, RendererInterface $renderer, ExtensionList $module_extension_list) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->permissionHandler = $permission_handler;
    $this->renderer = $renderer;
    $this->moduleExtensionList = $module_extension_list;
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
      $container->get('user.permissions'),
      $container->get('renderer'),
      $container->get('extension.list.module')
    );
  }

  /**
   * Responds to GET requests.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The response containing the list of available permissions.
   */
  public function get() {
    $context = new RenderContext();
    
    $permissions = $this->renderer->executeInRenderContext($context, function () {
      $permissions = $this->permissionHandler->getPermissions();
      foreach ($permissions as $id => $permission) {
        $permissions[$id]['id'] = $id;
        $permissions[$id]['provider_label'] = $this->moduleExtensionList->getName($permissions[$id]['provider']);
        // @todo Make a helper method to automatically render elements.
        if (is_array($permissions[$id]['description'])) {
          $permissions[$id]['description'] = $this->renderer->render($permissions[$id]['description']);
        }
      };
      return array_values($permissions);
    });

    $response = new ResourceResponse($permissions);
    $response->addCacheableDependency($context);
    return $response;
  }

  /**
   * {@inheritdoc}
   */
  public function permissions() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  protected function getBaseRoute($canonical_path, $method) {
    $route = parent::getBaseRoute($canonical_path, $method);
    $route->addRequirements(['_permission' => 'administer permissions']);
    return $route;
  }

}
