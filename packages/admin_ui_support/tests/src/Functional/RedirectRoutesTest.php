<?php

namespace Drupal\Tests\admin_ui_support\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Tests redirects of routes.
 *
 * @group admin_ui_support
 */
class RedirectRoutesTest extends BrowserTestBase {

  public static $modules = ['user', 'admin_ui_support'];

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();
    $this->drupalLogin($this->createUser([
      'administer permissions',
      'administer site configuration',
    ]));
  }

  /**
   * Tests if routes are redirect based on config setting.
   *
   * @see \Drupal\admin_ui_support\Routing\RouteSubscriber::alterRoutes()
   * @see \Drupal\admin_ui_support\Controller\DefaultController::getAppRoute()
   *
   * @throws \Behat\Mink\Exception\ResponseTextException
   * @throws \Behat\Mink\Exception\ExpectationException
   */
  public function testRouteRedirect() {
    if (!\Drupal::configFactory()->get('admin_ui_support.settings')->get('redirect_related_routes')) {
      $this->fail('redirect_related_routes should be enabled when is first enabled');
    }
    $paths = [
      '/admin/people/permissions',
      '/admin/people/roles',
    ];

    /** @var \Drupal\Core\Routing\RouteProvider $route_provider */
    $route_provider = \Drupal::service('router.route_provider');
    foreach ($paths as $path) {
      $routes = $route_provider->getRoutesByPattern($path);
      $this->assertEquals(1, $routes->count());
      foreach ($routes as $route) {
        $this->assertEquals('Drupal\admin_ui_support\Controller\DefaultController::getAppRoute', $route->getDefault('_controller'));
      }
    }

    $this->drupalGet('/admin/config/system/admin-ui-support');
    $this->assertSession()->checkboxChecked('redirect_related_routes');
    $this->drupalPostForm('/admin/config/system/admin-ui-support', ['redirect_related_routes' => 0], 'Save configuration');

    if (\Drupal::configFactory()->get('admin_ui_support.settings')->get('redirect_related_routes')) {
      $this->fail('redirect_related_routes should be disable after form submitted');
    }
    \Drupal::service('router.builder')->rebuildIfNeeded();
    // After the setting is updated the paths should go to the default page.
    /** @var \Drupal\Core\Routing\RouteProvider $route_provider */
    $route_provider = \Drupal::service('router.route_provider');
    foreach ($paths as $path) {
      $routes = $route_provider->getRoutesByPattern($path);
      $this->assertEquals(1, $routes->count());
      foreach ($routes as $route) {
        $this->assertNotEquals('Drupal\admin_ui_support\Controller\DefaultController::getAppRoute', $route->getDefault('_controller'));
      }
    }
  }

}