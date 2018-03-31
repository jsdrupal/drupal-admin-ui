<?php

namespace Drupal\admin_ui_support\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DefaultController extends ControllerBase {

  /**
   * Redirects the user to the JS application.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The current request.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   The current response.
   */
  public function getAppRoute(Request $request) {
    // Redirect to the vfancy location.
    // @todo Just redirect when JS is enabled.
    $route = $this->getRouteMatch()->getRouteObject();

    if ($route) {
      $url = Url::fromUri('base://vfancy')
        ->mergeOptions([
          'query' => [
            // @todo This is quite hacky right now.
            'q' => Url::fromRoute('<current>')->mergeOptions(['query' => $request->query->all()])->toString(TRUE)->getGeneratedUrl(),
          ],
        ]);

      return new RedirectResponse($url->toString(TRUE)->getGeneratedUrl());
    }
    throw new NotFoundHttpException();
  }

  /**
   * Returns the route match.
   *
   * @return \Drupal\Core\Routing\RouteMatchInterface
   */
  protected function getRouteMatch() {
    return \Drupal::routeMatch();
  }

}
