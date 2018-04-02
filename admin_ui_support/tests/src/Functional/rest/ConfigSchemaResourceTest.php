<?php

namespace Drupal\Tests\admin_ui_support\Functional\rest;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Url;
use Drupal\rest\RestResourceConfigInterface;
use Drupal\Tests\rest\Functional\CookieResourceTestTrait;
use Drupal\Tests\rest\Functional\ResourceTestBase;

/**
 * Tests the config schema resource.
 *
 * @group user
 */
class ConfigSchemaResourceTest extends ResourceTestBase {

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
  protected static $resourceConfigId = 'config_schema';

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
  protected function provisionResource($formats = [], $authentication = []) {
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

  public function testConfigSchema() {
    $this->initAuthentication();
    $url = Url::fromRoute('rest.config_schema.GET', ['_format' => static::$format, 'name' => 'system.site']);
    $request_options = $this->getAuthenticationRequestOptions('GET');

    $response = $this->request('GET', $url, $request_options);
    $this->assertResourceResponse(200, false, $response, ['config:rest.resource.config_schema', 'config:rest.settings', 'http_response'], [], FALSE, 'MISS');
    $result_config_schema = json::decode((string) $response->getBody());

    $expected_config_schema = \Drupal::service('config.typed')->getDefinition('system.site');
    $this->assertSame($expected_config_schema, $result_config_schema);
  }

  /**
   * {@inheritdoc}
   */
  protected function setUpAuthorization($method) {
    switch ($method) {
      case 'GET':
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
