import Content from './components/05_pages/Content';
import Permissions from './components/05_pages/Permissions/Permissions';
import Roles from './components/05_pages/Roles';

// @todo Share this with Drupal
const routes = {
  '/admin/content/': Content,
  '/admin/people/permissions/:role?': Permissions,
  '/admin/people/roles/': Roles,
};

export default routes;
