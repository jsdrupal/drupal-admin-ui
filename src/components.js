import loadable from 'loadable-components';

const Home = loadable(() => import('./components/05_pages/Home/Home'));
const Permissions = loadable(() => import('./components/05_pages/Permissions/Permissions'));

export { Home, Permissions }
