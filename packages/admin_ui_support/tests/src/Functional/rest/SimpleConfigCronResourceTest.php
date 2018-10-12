<?php

namespace Drupal\Tests\admin_ui_support\Functional\rest;

/**
 * Tests the automated_cron.settings simple config resource.
 *
 * @group admin_ui_support
 */
class SimpleConfigCronResourceTest extends SimpleConfigTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $resourceConfigId = 'simple_config.automated_cron_settings';

  /**
   * {@inheritdoc}
   */
  public static $modules = ['automated_cron'];

  protected $configName = 'automated_cron.settings';

  /**
   * {@inheritdoc}
   */
  protected function getExpectedGetCacheTags() {
    return array_merge(['config:automated_cron.settings'], parent::getExpectedGetCacheTags());
  }

  /**
   * {@inheritdoc}
   */
  protected function getSimpleConfigData() {
    $data = [
      'interval' => '10900',
    ];
    return $data;
  }

  /**
   * Gets the data to use to patch the simple config.
   *
   * @return array
   *   The data.
   */
  protected function getSimpleConfigPatchData() {
    $data = [
      'interval' => '10901',
    ];
    return $data;
  }
}
