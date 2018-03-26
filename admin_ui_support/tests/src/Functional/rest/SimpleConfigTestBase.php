<?php

namespace Drupal\Tests\admin_ui_support\Functional\rest;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Url;
use Drupal\rest\RestResourceConfigInterface;
use Drupal\Tests\rest\Functional\CookieResourceTestTrait;
use Drupal\Tests\rest\Functional\ResourceTestBase;

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
  protected function provisionResource($formats = [], $authentication = []) {
    $this->resourceConfigStorage->create([
      'id' => static::$resourceConfigId,
      'granularity' => RestResourceConfigInterface::RESOURCE_GRANULARITY,
      'configuration' => [
        'methods' => ['GET', 'POST', 'PATCH'],
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
  public function testGet() {
    $this->initAuthentication();
    $config = $this->createSimpleConfig();
    $url = Url::fromRoute('rest.' . static::$resourceConfigId . '.GET', ['_format' => static::$format]);
    $request_options = $this->getAuthenticationRequestOptions('GET');

    $response = $this->request('GET', $url, $request_options);
    $this->assertResourceResponse(403, '{"message":"The \u0027' . $this->getPermission() . '\u0027 permission is required."}', $response);

    $this->setUpAuthorization('GET');

    $response = $this->request('GET', $url, $request_options);
    $this->assertResourceResponse(200, FALSE, $response, $this->getExpectedGetCacheTags(), ['user.permissions'], FALSE, 'MISS');
    $response_data = Json::decode((string) $response->getBody());
    $this->assertEquals($config->get(), $response_data);
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
  protected function getPermission() {
    return 'restful get simple_config:' . str_replace('.', '_', $this->configName);
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
        $this->grantPermissionsToTestedRole([$this->getPermission()]);
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
