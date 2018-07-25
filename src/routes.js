import React from 'react';
import AddContent from './components/05_pages/AddContent';
import Content from './components/05_pages/Content/Content';
import NodeForm from './components/05_pages/NodeForm';
import UiMetadata from './components/05_pages/NodeForm/UiMetadata';
import widgets from './components/05_pages/NodeForm/Widgets';

// @todo Share this with Drupal
const routes = {
  '/admin/content': Content,
  '/node/add': AddContent,
  '/node/add/recipe': () => (
    <NodeForm
      entityTypeId="node"
      bundle="recipe"
      uiMetadata={UiMetadata}
      widgets={widgets}
    />
  ),
};

export default routes;
