import Loadable from 'react-loadable';
import Loading from './components/02_atoms/Loading/Loading';

const AddContent = Loadable({
  loader: () => import('./components/05_pages/AddContent'),
  loading: Loading,
});
const Content = Loadable({
  loader: () => import('./components/05_pages/Content/Content'),
  loading: Loading,
});
const Permissions = Loadable({
  loader: () => import('./components/05_pages/Permissions/Permissions'),
  loading: Loading,
});
const Roles = Loadable({
  loader: () => import('./components/05_pages/Roles'),
  loading: Loading,
});
const Dblog = Loadable({
  loader: () => import('./components/05_pages/Reports/Dblog'),
  loading: Loading,
});
const NodeEditForm = Loadable({
  loader: () => import('./components/05_pages/NodeEditForm'),
  loading: Loading,
});
const NodeAddForm = Loadable({
  loader: () => import('./components/05_pages/NodeAddForm'),
  loading: Loading,
});

// @todo Share this with Drupal
const routes = {
  '/admin/content': Content,
  '/admin/people/permissions/:role?': Permissions,
  '/admin/people/roles': Roles,
  '/admin/reports/dblog': Dblog,
  '/node/add': AddContent,
  '/node/:nid/edit': NodeEditForm,
  '/node/add/:bundle': NodeAddForm,
};

export default routes;
