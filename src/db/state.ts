interface State {
  DOM_DATA: DomTree; // 页面数据
  DOM_MAP: { [propname: string]: DomItem }; // 扁平树
  CUR_EL: HTMLElement | null; // 当前编辑元素
  CUR_KEY: string; // 当前编辑key
  DRAG_EL: DomItem | null; // 拖动元素
  PAGE_USE: number;// 当前编辑页面索引
  CUR_PAGE: PageItem | null; // 当前页面数据
  MyRenderEngine: any; // 渲染引擎实例
  Panzoom: any; // 拖动缩放库实例
  MyDB: any; // 数据库
}


const State: State = {
  DOM_DATA: {
    appName: '测试应用',
    plugins: [],
    pages: [
      {
        type: 'page',
        id: 'page1',
        title: '测试标题',
        style: {
          width: '1200px',
          minHeight: '500px',
          border: '1px dashed red'
        },
        child: []
      },
      {
        type: 'page',
        id: 'page2',
        title: '测试标题',
        style: {
          width: '1200px',
          minHeight: '500px',
          border: '1px dashed red'
        },
        child: []
      }
    ],
  },
  DOM_MAP: {},
  CUR_EL: null,
  CUR_KEY: '',
  DRAG_EL: null,
  PAGE_USE: 0,
  CUR_PAGE: null,
  MyRenderEngine: null,
  Panzoom: null,
  MyDB: null,
}

State.CUR_PAGE = State.DOM_DATA.pages[State.PAGE_USE];
export default State
