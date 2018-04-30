<?php

namespace Drupal\admin_ui_support_schemata\Controller;

use Drupal\admin_ui_support_schemata\Schema\SimpleConfigSchema;
use Drupal\Core\Config\TypedConfigManagerInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class Controller implements ContainerInjectionInterface {

  /**
   * @var \Drupal\Core\Config\TypedConfigManagerInterface
   */
  protected $typedConfigManager;

  /**
   * @var \Symfony\Component\Serializer\SerializerInterface
   */
  private $serializer;

  /**
   * Routes constructor.
   * @param \Drupal\Core\Config\TypedConfigManagerInterface $typedConfigManager
   * @param \Symfony\Component\Serializer\SerializerInterface $serializer
   */
  public function __construct(TypedConfigManagerInterface $typedConfigManager, SerializerInterface $serializer) {
    $this->typedConfigManager = $typedConfigManager;
    $this->serializer = $serializer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.typed'),
      $container->get('serializer')
    );
  }

  public function serializeSimpleConfig($simple_config_name, Request $request) {
    $parts = $this->extractFormatNames($request);
    $format = implode(':', $parts);

    $definition = $this->typedConfigManager->getDefinition($simple_config_name);;
    $typed_data_definition = $this->typedConfigManager->buildDataDefinition($definition, null, $simple_config_name);

    // @todo For some reason MapDataDefinition doens't return its subentries
    // in ::getPropertyDefinitions.
    $properties = array_map(function ($def) {
      return $this->typedConfigManager->buildDataDefinition($def, null);
    }, $definition['mapping']);

    return new Response($this->serializer->serialize(new SimpleConfigSchema($typed_data_definition, $simple_config_name, $properties), $format));
  }

  /**
   * Helper function that inspects the request to extract the formats.
   *
   * Extracts the format of the response and media type being described.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return array
   *   An array containing the format of the output and the media type being
   *   described.
   */
  protected function extractFormatNames(Request $request) {
    return [
      $request->getRequestFormat(),
      $request->query->get('_describes', ''),
    ];
  }

}
