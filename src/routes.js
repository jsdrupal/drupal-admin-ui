import Permissions from './components/05_pages/Permissions/Permissions';
import Roles from './components/05_pages/Roles/Roles';

// @todo Share this with Drupal
const routes = {
  '/admin/people/permissions/:role?': Permissions,
  '/admin/people/roles/': Roles,
};

export default routes;
