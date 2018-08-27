import React from 'react';
import loadable from 'loadable-components';

import widgets from './components/05_pages/NodeForm/Widgets';

const AddContent = loadable(() => import('./components/05_pages/AddContent'));
const Content = loadable(() => import('./components/05_pages/Content/Content'));
const Permissions = loadable(() =>
  import('./components/05_pages/Permissions/Permissions'),
);
const Roles = loadable(() => import('./components/05_pages/Roles'));
const Dblog = loadable(() => import('./components/05_pages/Reports/Dblog'));
const NodeEditForm = loadable(() =>
  import('./components/05_pages/NodeEditForm'),
);
const NodeAddForm = loadable(() => import('./components/05_pages/NodeAddForm'));

// @todo Share this with Drupal
const routes = {
  '/admin/content': Content,
  '/admin/people/permissions/:role?': Permissions,
  '/admin/people/roles': Roles,
  '/admin/reports/dblog': Dblog,
  '/node/add': AddContent,
  // eslint-disable-next-line react/prop-types
  '/node/:nid/edit': ({ match }) => (
    <NodeEditForm
      entityTypeId="node"
      widgets={widgets}
      nid={match.params.nid}
    />
  ),
  // eslint-disable-next-line react/prop-types
  '/node/add/:bundle': ({ match }) => (
    <NodeAddForm
      entityTypeId="node"
      bundle={match.params.bundle}
      widgets={widgets}
    />
  ),
};

export default routes;
