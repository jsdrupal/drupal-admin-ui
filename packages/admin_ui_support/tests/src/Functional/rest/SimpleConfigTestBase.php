<?php

namespace Drupal\Tests\admin_ui_support\Functional\rest;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Url;
use Drupal\rest\RestResourceConfigInterface;
use Drupal\Tests\rest\Functional\CookieResourceTestTrait;
use Drupal\Tests\rest\Functional\ResourceTestBase;
use GuzzleHttp\RequestOptions;

/**
 * Abstract class for simple config resource testing.
 */
abstract class SimpleConfigTestBase extends ResourceTestBase {

  use CookieResourceTestTrait;

  /**
   * {@inheritdoc}
   */
  protected static $format = 'json';

  /**
   * {@inheritdoc}
   */
  protected static $mimeType = 'application/json';

  /**
   * {@inheritdoc}
   */
  protected static $auth = 'cookie';

  /**
   * The config name.
   *
   * @var string
   */
  protected $configName;

  /**
   * {@inheritdoc}
   */
  public static $modules = ['user', 'rest', 'admin_ui_support'];

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
        'methods' => ['GET', 'PATCH'],
        'formats' => $formats,
        'authentication' => $authentication,
      ],
      'status' => TRUE,
    ])->save();
    $this->refreshTestStateAfterRestConfigChange();
  }

  /**
   * Test GET request.
   */
  public function testGet() {
    $this->initAuthentication();
    $config = $this->createSimpleConfig();
    $url = Url::fromRoute('rest.' . static::$resourceConfigId . '.GET', ['_format' => static::$format]);
    $request_options = $this->getAuthenticationRequestOptions('GET');

    $response = $this->request('GET', $url, $request_options);
    $this->assertResourceResponse(403, '{"message":"The \u0027' . $this->getPermission('GET') . '\u0027 permission is required."}', $response);

    $this->setUpAuthorization('GET');

    $response = $this->request('GET', $url, $request_options);
    $this->assertResourceResponse(200, FALSE, $response, $this->getExpectedGetCacheTags(), ['user.permissions'], FALSE, 'MISS');
    $response_data = Json::decode((string) $response->getBody());
    $this->assertEquals($config->get(), $response_data);
  }

  /**
   * Test PATCH request.
   */
  public function testPatch() {
    $this->initAuthentication();
    $this->createSimpleConfig();
    $url = Url::fromRoute('rest.' . static::$resourceConfigId . '.PATCH', ['_format' => static::$format]);
    $request_options = $this->getAuthenticationRequestOptions('PATCH');

    $request_options[RequestOptions::BODY] = Json::encode($this->getSimpleConfigPatchData());
    $request_options[RequestOptions::HEADERS]['Content-Type'] = static::$mimeType;
    $response = $this->request('PATCH', $url, $request_options);
    $this->assertResourceResponse(403, '{"message":"The \u0027' . $this->getPermission('PATCH') . '\u0027 permission is required."}', $response);

    $this->setUpAuthorization('PATCH');

    $response = $this->request('PATCH', $url, $request_options);
    $this->assertResourceResponse(200, FALSE, $response);
    $response_data = Json::decode((string) $response->getBody());
    $this->assertEquals($this->getSimpleConfigPatchData(), $response_data);
    $config = \Drupal::config($this->configName);
    $this->assertEquals($config->get(), $this->getSimpleConfigPatchData());

  }

  /**
   * Gets the expected cache tags.
   *
   * @return array
   *   The expected cache tags.
   */
  protected function getExpectedGetCacheTags() {
    return [
      'config:rest.resource.simple_config.' . str_replace('.', '_', $this->configName),
      'config:rest.settings',
      'http_response',
    ];
  }

  /**
   * Gets the permissions associated with the REST resource.
   *
   * @return string
   *   The permission.
   */
  protected function getPermission($method) {
    return 'restful ' . strtolower($method) . ' simple_config:' . str_replace('.', '_', $this->configName);
  }

  /**
   * Creates the simple config object.
   *
   * @return \Drupal\Core\Config\Config
   *   The simple config object created.
   */
  protected function createSimpleConfig() {
    $data = $this->getSimpleConfigData();
    $config = \Drupal::configFactory()->getEditable($this->configName);
    $config->setData($data);
    $config->save();
    return $config;
  }

  /**
   * {@inheritdoc}
   */
  protected function setUpAuthorization($method) {
    switch ($method) {
      case 'GET':
      case 'PATCH':
        $this->grantPermissionsToTestedRole([$this->getPermission($method)]);
        break;

      default:
        throw new \UnexpectedValueException();
    }
  }

  /**
   * Gets the data to use to create the simple config.
   *
   * @return array
   *   The data.
   */
  abstract protected function getSimpleConfigData();

  /**
   * Gets the data to use to patch the simple config.
   *
   * @return array
   *   The data.
   */
  abstract protected function getSimpleConfigPatchData();

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
