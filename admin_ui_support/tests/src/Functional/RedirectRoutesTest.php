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
    $this->drupalLogin($this->createUser(['administer permissions']));
  }

  /**
   * Tests if routes are redirect based on config setting.
   *
   * @see \Drupal\admin_ui_support\Routing\RouteSubscriber::alterRoutes()
   * @see \Drupal\admin_ui_support\Controller\DefaultController::getAppRoute()
   *
   * @throws \Behat\Mink\Exception\ResponseTextException
   */
  public function testRouteRedirect() {
    $paths = [
      'admin/people/permissions' => 'Permissions',
      'admin/people/roles' => 'Roles',
    ];

    // When the module is first enabled these paths will redirect an empty page
    // because the React App is available for testing.
    foreach ($paths as $path => $text) {
      $this->drupalGet($path);
      $this->assertSession()->pageTextNotContains($text);
    }


    \Drupal::configFactory()->getEditable('admin_ui_support.settings')->set('redirect_related_routes', FALSE)->save();
    \Drupal::service('router.builder')->rebuild();

    // After the config is updated the paths should go to the default page.
    foreach ($paths as $path => $text) {
      $this->drupalGet($path);
      $this->assertSession()->pageTextContains($text);
    }
  }

}