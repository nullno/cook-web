import styles from './index.module.less';
import { useRef, useState } from 'react';
import { useMount, useDrag, useSetState } from 'ahooks';
import drag from '@/utils/drag';
import STATE from '@/db/state';

import Layouts from '@/ingredients/layouts'
import Elements from '@/ingredients/elements'
import { deepCopyObj } from '@/utils/tool'

interface ViewState {
  tabUse: number;
  tabs: Array<ToolTab>
}

// 工具栏
const ToolBarBox = function () {
  const [viewState, setViewState] = useSetState<ViewState>({
    tabUse: 0,
    tabs: [
      { name: '布局', icon: 'fa-columns', event: '' },
      { name: '元素', icon: 'fa-cube', event: '' },
      { name: '组件', icon: 'fa-cubes', event: '' },
    ]
  });

  const switchTab = (i: number) => {
    setViewState({ tabUse: i })
  }

  useMount(() => {
    new drag(document.querySelector('#ToolBarBox'));
  });

  const DragLayoutItems = function ({ data }) {
    const dragRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    useDrag(data, dragRef, {
      onDragStart: () => {
        // setDragging(true);
        // @ts-ignore
        STATE.DRAG_EL = deepCopyObj(data);
      },
      onDragEnd: () => {
        // setDragging(false);
      },
    });
    return <li ref={dragRef}><i className='fa fa-gavel'></i><span> {data.name}</span></li>
  }

  return <div id="ToolBarBox" className={styles.toolBarBox}>
    <div className={styles.inner}>
      <ul className={styles.toolBarUl}>
        {viewState.tabs.map((item, i) => <li
          key={'tab-' + i}
          className={i === viewState.tabUse ? styles.active : ''}
          onClick={() => switchTab(i)}
        >
          <i className={'fa ' + item.icon} ></i>
          <span>{item.name}</span>
        </li>)}
      </ul>
    </div>
    <ul className={styles.wrap + ' ' + (viewState.tabUse === 0 ? styles.show : '')}>
      {Layouts.map((item, i) => <DragLayoutItems key={'layout-' + i} data={item} />)}
    </ul>
    <ul className={styles.wrap + ' ' + (viewState.tabUse === 1 ? styles.show : '')}>
      {Elements.map((item, i) => <DragLayoutItems key={'elements-' + i} data={item} />)}
    </ul>
    <ul className={styles.wrap + ' ' + (viewState.tabUse === 2 ? styles.show : '')}>
      组件
      {/* {Layouts.map((item, i) => <DragLayoutItems key={'layout-' + i} data={item} />)} */}
    </ul>

  </div>
}


export default ToolBarBox;
