import React from 'react';
import AddContent from './components/05_pages/AddContent';
import Content from './components/05_pages/Content/Content';
import Permissions from './components/05_pages/Permissions/Permissions';
import Roles from './components/05_pages/Roles';
import Dblog from './components/05_pages/Reports/Dblog';
import NodeForm from './components/05_pages/NodeForm';
import NodeEditForm from './components/05_pages/NodeEditForm';
import widgets from './components/05_pages/NodeForm/Widgets';

// @todo Share this with Drupal
const routes = {
  '/admin/content': Content,
  '/admin/people/permissions/:role?': Permissions,
  '/admin/people/roles': Roles,
  '/admin/reports/dblog': Dblog,
  '/node/add': AddContent,
  '/node/add/recipe': () => (
    <NodeForm entityTypeId="node" bundle="recipe" widgets={widgets} />
  ),
  '/node/:bundle/:id/edit': ({ match }) => (
    <NodeEditForm
      entityTypeId="node"
      bundle={match.params.bundle}
      widgets={widgets}
      id={match.params.id}
    />
  ),
};

export default routes;
