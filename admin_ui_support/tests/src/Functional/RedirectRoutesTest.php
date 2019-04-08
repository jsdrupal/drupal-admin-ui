<?php

namespace Drupal\Tests\admin_ui_support\Functional;

use Drupal\Tests\BrowserTestBase;
use Drupal\node\Entity\Node;
use Drupal\node\Entity\NodeType;

/**
 * Tests redirects of routes.
 *
 * @group admin_ui_support
 */
class RedirectRoutesTest extends BrowserTestBase {

  public static $modules = ['user', 'node', 'admin_ui_support'];

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();
    $this->drupalLogin($this->createUser([
      'administer permissions',
      'administer site configuration',
    ]));

    NodeType::create([
      'type' => 'page',
    ])->save();

    Node::create([
      'type' => 'page',
      'title' => 'Test title',
      'status' => 1,
    ])->save();
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
      '/node/add',
      '/node/add/page',
      '/node/1/edit',
    ];

    /** @var \Drupal\Core\Routing\RouteProvider $route_provider */
    $route_provider = \Drupal::service('router.route_provider');
    foreach ($paths as $path) {
      $routes = $route_provider->getRoutesByPattern($path);
      $this->assertGreaterThanOrEqual(1, $routes->count());
      foreach ($routes as $route_name => $route) {
        // The canonical node route /node/1 is a route suggestion for
        // /node/1/edit.
        if ($route_name !== 'entity.node.canonical') {
          $this->assertEquals('Drupal\admin_ui_support\Controller\DefaultController::getAppRoute', $route->getDefault('_controller'));
        }
      }
    }

    $this->drupalGet('/admin/config/system/admin-ui-support');
    $this->assertSession()->checkboxChecked('redirect_related_routes');
    $this->drupalPostForm('/admin/config/system/admin-ui-support', ['redirect_related_routes' => 0], 'Save configuration');

    if (\Drupal::configFactory()->get('admin_ui_support.settings')->get('redirect_related_routes')) {
      $this->fail('redirect_related_routes should be disable after form submitted');
    }
    // After the setting is updated the paths should go to the default page.
    /** @var \Drupal\Core\Routing\RouteProvider $route_provider */
    $route_provider = \Drupal::service('router.route_provider');
    foreach ($paths as $path) {
      $routes = $route_provider->getRoutesByPattern($path);
      $this->assertGreaterThanOrEqual(1, $routes->count());
      foreach ($routes as $route_name => $route) {
        // The canonical node route /node/1 is a route suggestion for
        // /node/1/edit.
        if ($route_name !== 'entity.node.canonical') {
          $this->assertNotEquals('Drupal\admin_ui_support\Controller\DefaultController::getAppRoute', $route->getDefault('_controller'));
        }
      }
    }
  }

}
