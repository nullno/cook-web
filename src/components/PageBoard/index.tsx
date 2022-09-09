
import styles from './index.module.less';
import { Modal, Input, message, Form } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSet, useSetState } from 'ahooks';
import STATE from '@/db/state';
import useDB from '@/db/use';

const { confirm } = Modal;

interface ViewState {
  pageList: PageItem[];
  pageUse: number;
  moreMax: number;
  modalVisible: boolean;
  newPageTitle: string;
  newPageId: string;
  isModify: boolean;
  modifyIndex: number | null;
}

const PageBoard = function (PB) {
  // const [pages, { add, remove }] = useSet<PageItem>(STATE.DOM_DATA.pages);
  const [viewState, setViewState] = useSetState<ViewState>({
    pageList: STATE.DOM_DATA.pages,
    pageUse: STATE.PAGE_USE,
    moreMax: 6,
    modalVisible: false,
    newPageTitle: '',
    newPageId: '',
    isModify: false,
    modifyIndex: null,
  });
  // const pageList: PageItem[] = Array.from(pages);
  // 新建页面
  const newPage = (): void => {
    if (!viewState.newPageTitle || !viewState.newPageId) {
      message.warning('请设置必填信息');
      return
    }
    const isSamePage = STATE.DOM_DATA.pages.some(item => item.id === viewState.newPageId)
    if (isSamePage) {
      message.error('已存在相同的页面名称');
      return
    }
    const Page: PageItem = {
      type: 'page',
      id: viewState.newPageId,
      title: viewState.newPageTitle,
      style: {
        width: '1200px',
        minHeight: '500px',
        border: '1px dashed red'
      },
      child: []
    };
    // add(Page);
    STATE.DOM_DATA.pages.push(Page);
    useDB.updateStore();
    setViewState({ pageList: STATE.DOM_DATA.pages, modalVisible: false, newPageTitle: '', newPageId: '' });
    message.success('创建成功！');
  }
  // 删除页面
  const delPage = (e: React.MouseEvent, Page: PageItem, i: number): void => {
    e.stopPropagation();
    if (STATE.DOM_DATA.pages.length < 2) {
      message.error('至少保留一个页面');
      return;
    };
    confirm({
      title: '确定要删除这个页面【' + Page.id + '】?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '考虑一下',
      onOk() {
        e.stopPropagation();
        // remove(Page);
        STATE.DOM_DATA.pages.splice(i, 1);
        setViewState({ pageList: STATE.DOM_DATA.pages });
        let pLen = viewState.pageList.length - 1;
        if (viewState.pageUse >= pLen) {
          switchPage(pLen - 1);
        }
      },
      onCancel() { },
    });
  }
  // 修改页面
  const modifyPage = () => {
    if (typeof viewState.modifyIndex != 'number') return;
    Object.assign(STATE.DOM_DATA.pages[viewState.modifyIndex], { id: viewState.newPageId, title: viewState.newPageTitle })
    setViewState({ pageList: STATE.DOM_DATA.pages, modalVisible: false, isModify: false, newPageTitle: '', newPageId: '', modifyIndex: null });
    useDB.updateStore();
    document.title = 'cooking-' + viewState.newPageTitle;
    message.success('修改成功！');
  }
  // 切换页面
  const switchPage = (i: number): void => {
    if (STATE.PAGE_USE === i) return;
    STATE.PAGE_USE = i;
    STATE.CUR_PAGE = STATE.DOM_DATA.pages[i];
    setViewState({ pageUse: i });
    PB.$switchPage.emit(i);
    useDB.updateStore();
  }

  return <><div id="PageBoard" className={styles['page-board']}>
    <ul className={styles['page-list']}>
      {viewState.pageList.map((item, idx) => <li
        key={item.type + idx}
        style={{ zIndex: idx }}
        className={(viewState.pageUse === idx ? styles.active : '') + ' ' + (viewState.pageList.length >= viewState.moreMax ? styles.more : '')}
        onClick={() => switchPage(idx)}
        onDoubleClick={() => setViewState({ modalVisible: true, newPageTitle: item.title, newPageId: item.id, isModify: true, modifyIndex: idx })}
      >
        <div>
          <i className="fa fa-file-text"></i>
          <span>{item.id}</span>
          <button className={styles['page-del']} onClick={(e) => delPage(e, item, idx)}>
            <i className="fa fa-close"></i>
          </button>
        </div>
      </li>)}
      <li onClick={() => setViewState({ modalVisible: true })}><div><i className="fa fa-add"></i><span>新建</span></div></li>
    </ul>
  </div>
    <Modal
      title={viewState.isModify ? "修改页面" : "新建页面"}
      centered
      width={350}
      okText="确认"
      cancelText="取消"
      visible={viewState.modalVisible}
      onOk={() => {
        viewState.isModify ? modifyPage() : newPage();
      }}
      onCancel={() => setViewState({ modalVisible: false, newPageTitle: '', newPageId: '', isModify: false, modifyIndex: null })}
    >
      <Input placeholder="请设置ID (英文/数字 不可重复)" value={viewState.newPageId} maxLength={20} onChange={(e) => {
        setViewState({ newPageId: e.target.value.replace(/[^\w\.\/]/ig, '') })
      }} />
      <Input placeholder="请设置标题" style={{ marginTop: '10px' }} value={viewState.newPageTitle} maxLength={10} onChange={(e) => {
        setViewState({ newPageTitle: e.target.value })
      }} />
    </Modal>
  </>
}

export default PageBoard;
