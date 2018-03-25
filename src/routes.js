import Permissions from './components/05_pages/Permissions/Permissions';
import Roles from './components/05_pages/Roles/Roles';
import SimpleConfig from './components/05_pages/SimpleConfig/SimpleConfig';

// @todo Share this with Drupal
const routes = {
  '/admin/people/permissions/:role?': Permissions,
  '/admin/people/roles/': Roles,
  '/admin/config/system/site-information': () => (
    <SimpleConfig name="system.site" onSubmit={console.log} />
  ),
};

export default routes;
