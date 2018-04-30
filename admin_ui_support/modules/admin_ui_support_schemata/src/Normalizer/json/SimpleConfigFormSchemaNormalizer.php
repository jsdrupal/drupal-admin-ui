<?php

namespace Drupal\admin_ui_support_schemata\Normalizer\json;

use Drupal\admin_ui_support_schemata\Schema\SimpleConfigSchema;
use Drupal\admin_ui_support_schemata\SimpleConfigSchemaUrl;
use Drupal\Component\Utility\NestedArray;
use Drupal\schemata_json_schema\Normalizer\json\JsonNormalizerBase;

class SimpleConfigFormSchemaNormalizer extends JsonNormalizerBase {

  /**
   * The interface or class that this Normalizer supports.
   *
   * @var string
   */
  protected $supportedInterfaceOrClass = 'Drupal\admin_ui_support_schemata\Schema\SimpleConfigSchema';

  /**
   * The formats that the Normalizer can handle.
   *
   * @var array
   */
  protected $format = 'schema_form_json';

  /**
   * {@inheritdoc}
   */
  public function normalize($simple_config_schema, $format = NULL, array $context = []) {
    /* @var $simple_config_schema \Drupal\admin_ui_support_schemata\Schema\SimpleConfigSchema */
    //@fixme
    $generated_url = SimpleConfigSchemaUrl::fromSchema($this->format, $this->describedFormat, $simple_config_schema)
      ->toString(TRUE);
    // Create the array of normalized fields, starting with the URI.
    $normalized = [
      '$schema' => 'TOOD link to our draft',
      'id' => $generated_url->getGeneratedUrl(),
      'type' => 'object',
    ];
    $normalized = array_merge($normalized, $simple_config_schema->getMetadata());

    // Stash schema request parameters.
    $context['simple_config_name'] = $simple_config_schema->getName();

    // Retrieve 'properties' and possibly 'required' nested arrays.
    $properties = $this->normalizeProperties(
      $this->getProperties($simple_config_schema, $format, $context),
      $format,
      $context
    );
    $normalized = NestedArray::mergeDeep($normalized, $properties);

    return $normalized;
  }

  /**
   * Identify properties of the data definition to normalize.
   *
   * This allow subclasses of the normalizer to build white or blacklisting
   * functionality on what will be included in the serialized schema. The JSON
   * Schema serializer already has logic to drop any properties that are empty
   * values after processing, but this allows cleaner, centralized logic.
   *
   * @param \Drupal\schemata\Schema\SchemaInterface $simple_config_schema
   *   The Schema object whose properties the serializer will present.
   * @param string $format
   *   The serializer format. Defaults to NULL.
   * @param array $context
   *   The current serializer context.
   *
   * @return \Drupal\Core\TypedData\DataDefinitionInterface[]
   *   The DataDefinitions to be processed.
   */
  protected static function getProperties(SimpleConfigSchema $simple_config_schema, $format = NULL, array $context = []) {
    return $simple_config_schema->getProperties();
  }

}

