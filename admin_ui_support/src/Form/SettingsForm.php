<?php

namespace Drupal\admin_ui_support\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Routing\RouteBuilderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Settings form for JS Drupal App integration.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * The router rebuilder.
   *
   * @var \Drupal\Core\Routing\RouteBuilderInterface
   */
  protected $routerRebuilder;

  /**
   * Constructs a \Drupal\system\ConfigFormBase object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   * @param \Drupal\Core\Routing\RouteBuilderInterface $route_rebuilder
   *   The route rebuilder.
   */
  public function __construct(ConfigFactoryInterface $config_factory, RouteBuilderInterface $route_rebuilder) {
    parent::__construct($config_factory);
    $this->routerRebuilder = $route_rebuilder;

  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('router.builder')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'admin_ui_support.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'admin_ui_support_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('admin_ui_support.settings');
    $form['redirect_related_routes'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use new administrative UI when available'),
      '#description' => $this->t('When checked, routes that have new administrative UI available will be rendered using the new decoupled JavaScript client.'),
      '#default_value' => $config->get('redirect_related_routes'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $redirect_related_routes = $form_state->getValue('redirect_related_routes');
    if ($this->config('admin_ui_support.settings')->get('redirect_related_routes') !== $redirect_related_routes) {
      $this->config('admin_ui_support.settings')
        ->set('redirect_related_routes', $redirect_related_routes)
        ->save();
      // Perform an immediate rebuild, instead of rebuildIfNeeded, otherwise the
      // setting here won't take effect for a period of time.
      $this->routerRebuilder->rebuild();
    }

  }

}
