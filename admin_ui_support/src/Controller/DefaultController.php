<?php

namespace Drupal\admin_ui_support\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Discovery\YamlDiscovery;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\JsonResponse;
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

  /**
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   */
  public function components() {
    return $this->loadExtensions('admin_ui.components', 'widgets');
  }

  /**
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   */
  public function routes() {
    return $this->loadExtensions('admin_ui.routes', 'routes');
  }

  private function loadExtensions($extension_point, $key) {
    $discovery = new YamlDiscovery($extension_point, $this->moduleHandler()->getModuleDirectories());
    $result = [$key => []];
    foreach ($discovery->findAll() as $module_name => $item) {
      $result[$key] = array_merge($result[$key], array_map(function ($widget) use ($module_name) {
        assert(file_exists(drupal_get_path('module', $module_name) . '/' . $widget['component']),
          "The {$widget['component']} bundle js file must exist. Ensure you executed the build process."
        );
        $widget['component'] = file_create_url(drupal_get_path('module', $module_name) . '/' . $widget['component']);
        $widget['moduleName'] = $module_name;
        return $widget;
      }, $item[$key]));
    }
    return new JsonResponse($result);
  }

}
