<?php

namespace Drupal\admin_ui_support\Plugin\rest\resource;

use Drupal\Component\Render\PlainTextOutput;
use Drupal\Core\Extension\ExtensionList;
use Drupal\Core\Extension\ModuleExtensionList;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\Core\Render\RenderContext;
use Drupal\Core\Render\RendererInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\user\PermissionHandlerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a rest resource for the menu tree.
 *
 * @RestResource(
 *   id = "menu_tree",
 *   label = @Translation("Available menu tree"),
 *   uri_paths = {
 *     "canonical" = "/admin-api/menu"
 *   }
 * )
 */
class MenuTreeResource extends ResourceBase {

  /**
   * The renderer.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * @var \Drupal\Core\Menu\MenuLinkTreeInterface
   */
  protected $menuLinkTree;

  /**
   * Constructs a MenuTreeResource object.
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
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer.
   * @param \Drupal\Core\Menu\MenuLinkTreeInterface $menuLinkTree
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, array $serializer_formats, LoggerInterface $logger, RendererInterface $renderer, MenuLinkTreeInterface $menuLinkTree) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->renderer = $renderer;
    $this->menuLinkTree = $menuLinkTree;
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
      $container->get('renderer'),
      $container->get('menu.link_tree')
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

    $menu_tree = $this->renderer->executeInRenderContext($context, function () {
      $parameters = new MenuTreeParameters();
      $parameters->setMinDepth(2)->setMaxDepth(4)->onlyEnabledLinks();
      $tree = $this->menuLinkTree->load('admin', $parameters);
      $manipulators = [
        ['callable' => 'menu.default_tree_manipulators:checkAccess'],
        ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
        ['callable' => 'toolbar_menu_navigation_links'],
      ];
      $tree = $this->menuLinkTree->transform($tree, $manipulators);
      return $tree;
    });

    $response = new ResourceResponse($menu_tree);
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
    $route->addRequirements(['_permission' => 'access toolbar']);
    return $route;
  }

}
