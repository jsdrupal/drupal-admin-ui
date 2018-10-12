<?php

namespace Drupal\Tests\jsonapi_support\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Tests that the CrossBundlesResourceType is compatible with OpenAPI.
 *
 * Currently the OpenAPI module is only able to determine that GET method exists
 * on the route and does not return the bundle generic entity definition.
 *
 * @group jsonapi_support
 */
class CrossBundleOpenApiCompatibilityTest extends BrowserTestBase {


  /**
   * {@inheritdoc}
   */
  public static $modules = [
    'basic_auth',
    'user',
    'serialization',
    'node',
    'schemata',
    'openapi',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();
    $this->createContentType([
      'type' => 'article',
    ]);
    \Drupal::service('module_installer')->install(['jsonapi', 'jsonapi_support']);
  }

  /**
   * Tests OpenAPI module is able to retrieve the cross bundle resource.
   */
  public function testOpenApi() {
    $this->drupalLogin($this->createUser([
      'access openapi api docs',
    ]));
    $openapi_json = $this->drupalGet('openapi/jsonapi', ['query' => ['_format' => 'json']]);
    $decoded = json_decode($openapi_json, TRUE);
    // Ensure that OpenAPI returns only the GET method for the cross bundle
    // resource.
    $this->assertEquals(['get'], array_keys($decoded['paths']['/node']));
  }

}
