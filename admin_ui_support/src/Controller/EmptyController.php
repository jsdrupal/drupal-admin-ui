<?php

namespace Drupal\admin_ui_support\Controller;

use Symfony\Component\HttpFoundation\Response;

class EmptyController {

  public function noop() {
    return new Response('');
  }

}
