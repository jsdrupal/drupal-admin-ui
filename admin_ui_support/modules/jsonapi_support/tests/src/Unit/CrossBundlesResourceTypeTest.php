<?php

namespace Drupal\Tests\jsonapi_support\Unit;

use Drupal\jsonapi_support\ResourceType\CrossBundlesResourceType;
use Drupal\node\Entity\Node;
use Drupal\Tests\UnitTestCase;

/**
 * @coversDefaultClass \Drupal\jsonapi_support\ResourceType\CrossBundlesResourceType
 *
 * @group jsonapi_support
 */
class CrossBundlesResourceTypeTest extends UnitTestCase {

  /**
   * The resource.
   *
   * @var \Drupal\jsonapi_support\ResourceType\CrossBundlesResourceType
   */
  protected $resource;

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();
    $this->resource = new CrossBundlesResourceType(
      'node',
      'node',
      Node::class
    );
  }

  /**
   * @covers ::getBundle
   */
  public function testGetBundle() {
    $this->assertEmpty($this->resource->getBundle());
  }

  /**
   * @covers ::getPath
   */
  public function testGetPath() {
    $this->assertEquals('node', $this->resource->getPath());
  }

}
