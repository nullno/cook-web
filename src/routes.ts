import { IRouterConfig, lazy } from 'ice';

const Home = lazy(() => import('@/pages/Home'));
const Preview = lazy(() => import('@/pages/Preview'));

const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: Home,
    exact: true,
    pageConfig: {
      title: 'cooking'
    }
  },
  {
    path: '/preview/:pid',
    component: Preview,
    exact: true,
    // pageConfig: {
    //   title: '预览'
    // }
  },

];

export default routerConfig;
