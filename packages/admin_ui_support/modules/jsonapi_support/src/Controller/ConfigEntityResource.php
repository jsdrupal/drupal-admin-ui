<?php

namespace Drupal\jsonapi_support\Controller;

use Drupal\Core\Entity\EntityInterface;
use Drupal\jsonapi\Controller\EntityResource;
use Drupal\jsonapi\Exception\EntityAccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

/**
 * Process Config Entity Requests.
 */
class ConfigEntityResource extends EntityResource {

  /**
   * {@inheritdoc}
   *
   * Overridden to remove validation which isn't supported by config entitie.
   *
   * @see https://www.drupal.org/project/drupal/issues/2300677
   */
  public function createIndividual(EntityInterface $entity, Request $request) {
    $entity_access = $entity->access('create', NULL, TRUE);

    if (!$entity_access->isAllowed()) {
      throw new EntityAccessDeniedHttpException(NULL, $entity_access, '/data', 'The current user is not allowed to POST the selected resource.');
    }

    // Return a 409 Conflict response in accordance with the JSON API spec. See
    // http://jsonapi.org/format/#crud-creating-responses-409.
    if ($this->entityExists($entity)) {
      throw new ConflictHttpException('Conflict: Entity already exists.');
    }

    $entity->save();

    // Build response object.
    $response = $this->buildWrappedResponse($entity, 201);

    // According to JSON API specification, when a new entity was created
    // we should send "Location" header to the frontend.
    $entity_url = $this->linkManager->getEntityLink(
      $entity->uuid(),
      $this->resourceType,
      [],
      'individual'
    );
    $response->headers->set('Location', $entity_url);

    // Return response object with updated headers info.
    return $response;
  }

}
