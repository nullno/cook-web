import { runApp, IAppConfig } from 'ice';
import { Spin } from 'antd';
import connectDB from './db/connect'
import useDB from './db/use'
import STATE from './db/state'

import 'antd/dist/antd.css';
import '@/assets/global.css';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  router: {
    type: 'hash',
    basename: '/',
    fallback: <Spin size="large" className='loading-ready' />,
    modifyRoutes: (routes) => {
      return routes;
    }
  }
};

connectDB.then(async (mydb) => {
  STATE.MyDB = mydb;
  const Res = await useDB.myStore() as DBStore;
  if (!Res) {
    await useDB.setStore();
  } else {
    STATE.PAGE_USE = Res.page_use;
    STATE.DOM_DATA = Res.dom_tree;
    STATE.CUR_PAGE = STATE.DOM_DATA.pages[STATE.PAGE_USE];
  }
  runApp(appConfig);
})


