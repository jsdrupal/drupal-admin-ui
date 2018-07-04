import React from 'react';
import Content from './components/05_pages/Content/Content';
import Permissions from './components/05_pages/Permissions/Permissions';
import Roles from './components/05_pages/Roles';
import Dblog from './components/05_pages/Reports/Dblog';
import NodeForm from './components/05_pages/NodeForm';
import UiMetadata from './components/05_pages/NodeForm/UiMetadata';
import widgets from './components/05_pages/NodeForm/Widgets';

// @todo Share this with Drupal
const routes = {
  '/admin/content': Content,
  '/admin/people/permissions/:role?': Permissions,
  '/admin/people/roles/': Roles,
  '/admin/reports/dblog/': Dblog,
  '/node/add/recipes': () => <NodeForm uiMetadata={UiMetadata} widgets={widgets}/>,
};

export default routes;
