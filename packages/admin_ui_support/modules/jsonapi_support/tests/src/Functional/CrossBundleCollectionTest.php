<?php

namespace Drupal\Tests\jsonapi_support\Functional;

use Drupal\Component\Serialization\Json;
use Drupal\node\Entity\Node;
use Drupal\Tests\BrowserTestBase;
use GuzzleHttp\RequestOptions;

/**
 * Test for entity level collection-only entity level resources.
 *
 * @group jsonapi_support
 */
class CrossBundleCollectionTest extends BrowserTestBase {

  public static $modules = [
    'basic_auth',
    'user',
    'serialization',
    'node',
  ];

  /**
   * The HTTP client.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    // Set up a HTTP client that accepts relative URLs.
    $this->httpClient = $this->container->get('http_client_factory')
      ->fromOptions(['base_uri' => $this->baseUrl]);

    $this->createContentType([
      'type' => 'article',
    ]);
    $this->createNode([
      'type' => 'article',
      'title' => 'The article title',
      'uid' => 1,
      'body' => [
        ['value' => 'The article body'],
      ],
    ]);
    $this->createNode([
      'type' => 'article',
      'title' => 'The article2 title',
      'uid' => 1,
      'body' => [
        ['value' => 'The article2 body'],
      ],
    ]);
    $this->createContentType([
      'type' => 'page',
    ]);
    $this->createNode([
      'type' => 'page',
      'uid' => 1,
      'title' => 'The page title',
      'body' => [
        ['value' => 'The page body'],
      ],
    ]);
    $this->drupalLogin($this->createUser([
      'access content',
      'access user profiles',
    ]));
    \Drupal::service('module_installer')->install(['jsonapi', 'jsonapi_support']);
  }

  /**
   * Tests the collection only resource.
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   */
  public function testCollection() {
    $this->drupalLogin($this->createUser([
      'access user profiles',
    ]));
    $data = $this->getDecodedGet('jsonapi/node')['data'];
    $this->assertEquals(
      [
        'The article title',
        'The article2 title',
        'The page title',
      ],
      $this->getDataTitles($data)
    );

    $filter = [
      'type' => ['value' => 'article'],
    ];
    $data = $this->getDecodedGet('jsonapi/node', ['filter' => $filter])['data'];
    $this->assertEquals(
      [
        'The article title',
        'The article2 title',
      ],
      $this->getDataTitles($data)
    );

    $filter = [
      'type' => ['value' => 'page'],
    ];
    $data = $this->getDecodedGet('jsonapi/node', ['filter' => $filter])['data'];

    $this->assertEquals(
      [
        'The page title',
      ],
      $this->getDataTitles($data)
    );

    $filter = [
      'title' => ['value' => 'The article2 title'],
    ];
    $data = $this->getDecodedGet('jsonapi/node', ['filter' => $filter])['data'];

    $this->assertEquals(
      [
        'The article2 title',
      ],
      $this->getDataTitles($data)
    );

    // Ensure that "include" works in query.
    $json_response = $this->getDecodedGet('jsonapi/node', ['include' => 'uid']);
    $data = $json_response['data'];
    $this->assertEquals(
      [
        'The article title',
        'The article2 title',
        'The page title',
      ],
      $this->getDataTitles($data)
    );
    $node_uid_uuid = $data[0]['relationships']['uid']['data']['id'];
    $included_uuid = $json_response['included'][0]['attributes']['uuid'];
    $this->assertEquals($node_uid_uuid, $included_uuid);

    // Ensure that "sort" works in query.
    $query = [
      'sort[sort-title][path]' => 'title',
      'sort[sort-title][direction]' => 'DESC',
    ];
    $json_response = $this->getDecodedGet('jsonapi/node', $query);
    $data = $json_response['data'];
    $this->assertEquals(
      [
        'The page title',
        'The article2 title',
        'The article title',
      ],
      $this->getDataTitles($data)
    );

    // Confirm that all of the other methods/routes have been removed from the
    // resource.
    $request_options[RequestOptions::HTTP_ERRORS] = FALSE;
    $response = $this->httpClient->request('POST', 'jsonapi/node', $request_options);
    $this->assertEquals('405', $response->getStatusCode());
    foreach (['POST', 'PATCH', 'DELETE'] as $method) {
      $response = $this->httpClient->request($method, 'jsonapi/node/' . Node::load(1)->uuid(), $request_options);
      $this->assertEquals('404', $response->getStatusCode());
    }
  }

  /**
   * Gets the 'title' attribute from each data element.
   *
   * @param array $data
   *   The jsonapi data response.
   *
   * @return string[]
   *   The titles.
   */
  protected function getDataTitles(array $data) {
    return array_map(function ($datum) {
      return $datum['attributes']['title'];
    }, $data);
  }

  /**
   * Gets decoded GET response.
   *
   * @return array
   *   The decoded response.
   */
  protected function getDecodedGet($path, array $query = []) {
    return Json::decode($this->drupalGet($path, ['query' => $query]));
  }

}
