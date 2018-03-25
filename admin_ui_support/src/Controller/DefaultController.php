<?php

namespace Drupal\admin_ui_support\Controller;

use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DefaultController {

  /**
   * Redirects the user to the JS application.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function getAppRoute() {
    // Redirect to the vfancy location.
    // @todo Just redirect when JS is enabled.
    $route = $this->getRouteMatch()->getRouteObject();

    if ($route) {
      $route_url = Url::fromRoute($route->getDefault('_override_route_name'),
        $this->getRouteMatch()->getRawParameters()->all())
        ->setAbsolute(FALSE);

      $url = Url::fromUri('base://vfancy')
        ->mergeOptions([
          'query' => [
            // @todo This is quite hacky right now.
            'q' => ltrim(str_replace('/vfancy', '', $route_url->toString(TRUE)
              ->getGeneratedUrl()), '/'),
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
