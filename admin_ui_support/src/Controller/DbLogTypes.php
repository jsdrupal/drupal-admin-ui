<?php

namespace Drupal\admin_ui_support\Controller;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Dblog types controller.
 *
 * @todo Replace this control with JSON RPC plugin.
 */
class DbLogTypes implements ContainerInjectionInterface {

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * Constructs a DbLogTypes object.
   */
  public function __construct(ModuleHandlerInterface $module_handler) {
    $this->moduleHandler = $module_handler;
  }

  /**
   * Gets current dblog types.
   */
  public function get() {
    $levels = [];

    /* @todo Should the route to this controller be created dynamically or
     * should this module be dependent on dblog?
     * How does the React app handle routes for modules that aren't enabled?
     */
    if ($this->moduleHandler->moduleExists('dblog')) {
      $levels = array_values(_dblog_get_message_types());
    }
    return new JsonResponse($levels);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('module_handler')
    );
  }
}
