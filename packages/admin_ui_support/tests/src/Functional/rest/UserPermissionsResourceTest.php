<?php

namespace Drupal\Tests\admin_ui_support\Functional\rest;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Url;
use Drupal\rest\RestResourceConfigInterface;
use Drupal\Tests\rest\Functional\CookieResourceTestTrait;
use Drupal\Tests\rest\Functional\ResourceTestBase;

/**
 * Tests the user permissionsTest resource.
 *
 * @group admin_ui_support
 */
class UserPermissionsResourceTest extends ResourceTestBase {

  use CookieResourceTestTrait;

  /**
   * {@inheritdoc}
   */
  protected static $format = 'hal_json';

  /**
   * {@inheritdoc}
   */
  protected static $mimeType = 'application/hal+json';

  /**
   * {@inheritdoc}
   */
  protected static $auth = 'cookie';

  /**
   * {@inheritdoc}
   */
  protected static $resourceConfigId = 'permissions_collection';

  /**
   * {@inheritdoc}
   */
  public static $modules = ['hal', 'user', 'rest', 'admin_ui_support'];

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();

    $auth = isset(static::$auth) ? [static::$auth] : [];
    $this->provisionResource([static::$format], $auth);
  }

  /**
   * {@inheritdoc}
   */
  protected function provisionResource($formats = [], $authentication = [], array $methods = ['GET', 'POST', 'PATCH', 'DELETE']) {
    $this->resourceConfigStorage->create([
      'id' => static::$resourceConfigId,
      'granularity' => RestResourceConfigInterface::RESOURCE_GRANULARITY,
      'configuration' => [
        'methods' => ['GET'],
        'formats' => $formats,
        'authentication' => $authentication,
      ],
      'status' => TRUE,
    ])->save();
    $this->refreshTestStateAfterRestConfigChange();
  }

  /**
   * Writes a log messages and retrieves it via the REST API.
   */
  public function testPermissionsCollection() {
    $this->initAuthentication();
    $url = Url::fromRoute('rest.permissions_collection.GET', ['_format' => static::$format]);
    $request_options = $this->getAuthenticationRequestOptions('GET');

    $response = $this->request('GET', $url, $request_options);
    $this->assertResourceResponse(403, '{"message":"The \u0027administer permissionsTest\u0027 permission is required."}', $response);

    // create a user account that has the required permissionsTest to read
    // the watchdog resource via the rest api.
    $this->setUpAuthorization('GET');

    $response = $this->request('GET', $url, $request_options);
    // @todo This response should be a response 'MISS' not 'UNCACHEABLE'.
    $this->assertResourceResponse(200, false, $response, ['config:rest.resource.permissions_collection', 'config:rest.settings', 'http_response'], ['user.permissionsTest'], FALSE, 'UNCACHEABLE');
    $permissionsTest = json::decode((string) $response->getBody());

    $permission_handler = \drupal::service('user.permissionsTest')->getPermissions();
    $permission_ids = [];
    foreach ($permissionsTest as $permission) {
      $permission_ids[] = $permission['id'];
      if ($permission['id'] === 'administer permissionsTest') {
        $this->assertSame([
          'title' => 'Administer permissionsTest',
          'restrict access' => TRUE,
          'description' => NULL,
          'provider' => 'user',
          'id' => 'administer permissionsTest',
          'provider_label' => 'User',
        ], $permission);
      }
    }
    $this->assertSame(array_keys($permission_handler), $permission_ids);

  }

  /**
   * {@inheritdoc}
   */
  protected function setUpAuthorization($method) {
    switch ($method) {
      case 'GET':
        $this->grantPermissionsToTestedRole(['administer permissionsTest']);
        break;

      default:
        throw new \UnexpectedValueException();
    }
  }

  /**
   * {@inheritdoc}
   */
  protected function assertNormalizationEdgeCases($method, Url $url, array $request_options) {}

  /**
   * {@inheritdoc}
   */
  protected function getExpectedUnauthorizedAccessMessage($method) {}

  /**
   * {@inheritdoc}
   */
  protected function getExpectedUnauthorizedAccessCacheability() {}

}
