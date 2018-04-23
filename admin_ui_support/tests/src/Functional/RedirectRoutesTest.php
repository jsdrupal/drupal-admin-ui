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

    $this->drupalGet('admin/config/admin_ui_support/settings');
    $this->assertSession()->checkboxChecked('redirect_related_routes');
    $this->drupalPostForm('admin/config/admin_ui_support/settings', ['redirect_related_routes' => 0], 'Save configuration');

    // After the setting is updated the paths should go to the default page.
    foreach ($paths as $path => $text) {
      $this->drupalGet($path);
      $this->assertSession()->pageTextContains($text);
    }
  }

}