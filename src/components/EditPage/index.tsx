import styles from './index.module.less';
import { useRef } from 'react';
import { useSetState, useMount, useDrop, useClickAway, useEventListener, useScroll } from 'ahooks';
import { screen } from '@/utils/tool'

import ZoomPlugin from './ZoomPlugin';
import EditLineBox from './EditLineBox';

import cookEngine from '@/ingredients/cookEngine'

import STATE from '@/db/state';
// ace代码编辑器
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';


const SCREEN = {
  width: screen.width(),
  height: screen.height()
};

// 页面编辑容器
const EditPage = function (EP) {
  const [lineState, setLineState] = useSetState({
    show: false,
    style: {},
    mapKey: '',
  });

  const EditMainRef = useRef(null);
  const EditPageRef = useRef(null);

  const EditPage: HTMLDivElement = EditPageRef.current!;
  // 转移焦点
  const tranFocus = () => {
    const InputBlur = document.querySelector('#InputBlur') as HTMLInputElement;
    if (InputBlur) {
      InputBlur && InputBlur.focus();
    } else {
      const inputBlurEl = document.createElement('input');
      inputBlurEl.style.cssText = 'height:0;width:0;opacity:0;';
      inputBlurEl.id = "InputBlur";
      inputBlurEl.focus();
      document.body.appendChild(inputBlurEl);
    }
  }
  // 清除聚焦框
  const clearFocus = () => {
    STATE.DRAG_EL = null;
    setLineState({ show: false });
    const DefaultTip = document.querySelector('#DefaultTip');
    DefaultTip && DefaultTip.remove();

  }
  // 拖动元素释放
  useDrop(EditMainRef, {
    onDragEnter: (e) => {
      if (!e || !STATE.DRAG_EL) return;
    },
    onDrop(e) {
      if (!e || !STATE.DRAG_EL) return;
      const curDom = e.target as HTMLDivElement;
      const mapKey = curDom.getAttribute('data-key');
      if (mapKey) {
        STATE.MyRenderEngine.insert(curDom.getAttribute('data-pos'), STATE.DRAG_EL, mapKey)
      } else if (curDom.className.indexOf(cookEngine.prefix) > -1) {
        STATE.MyRenderEngine.add(STATE.DRAG_EL, curDom.getAttribute('key') || '')
      } else {
        STATE.MyRenderEngine.add(STATE.DRAG_EL)
      }
      clearFocus();
    }
  });

  // 点击外部清除聚焦框
  useClickAway((e) => {
    const node = e.target as HTMLDivElement;
    node.id === 'EditScreen' && clearFocus();
  }, EditMainRef);

  // 点击元素显示聚焦框
  useEventListener('click', (e) => {
    const cookDom = e.target as HTMLDivElement;
    if (!cookDom.className.includes(cookEngine.prefix)) {
      clearFocus();
      tranFocus();
      return;
    };
    clearFocus();
    STATE.CUR_EL = cookDom as HTMLDivElement;
    STATE.CUR_KEY = cookDom.getAttribute('key') || '';
    !STATE.CUR_EL.getAttribute('canEdit') && tranFocus();

    const pnode = cookDom.parentNode as HTMLDivElement;
    let topVal = cookDom.offsetTop - pnode.scrollTop;
    let leftVal = cookDom.offsetLeft - pnode.scrollLeft;
    // 父元素定位处理
    if (pnode.style.position && pnode.style.position != 'static') {
      topVal += pnode.offsetTop;
      leftVal += pnode.offsetLeft;
    }
    // transform 处理
    const transform = pnode.style.transform || cookDom.style.transform || 'none'

    setLineState({
      show: true,
      mapKey: STATE.CUR_KEY,
      style: {
        width: (cookDom.offsetWidth) + 'px',
        height: (cookDom.offsetHeight) + 'px',
        top: topVal + 'px',
        left: leftVal + 'px',
        transform: transform
      },
    });
    pnode.onscroll = function (e) {
      setLineState({
        style: {
          width: (cookDom.offsetWidth) + 'px',
          height: (cookDom.offsetHeight) + 'px',
          top: (cookDom.offsetTop - pnode.scrollTop) + 'px',
          left: (cookDom.offsetLeft - pnode.scrollLeft) + 'px',
          transform: transform
        }
      })
    }
  }, { target: EditPageRef });

  // 滚动聚焦框位置改变
  useScroll(EditPageRef, (val) => {
    (lineState.show && STATE.CUR_EL) && setLineState({
      style: {
        ...lineState.style,
        top: (STATE.CUR_EL.offsetTop - val.top) + 'px',
        left: (STATE.CUR_EL.offsetLeft - val.left) + 'px'
      }
    })
    return true;
  });
  const createEngine = () => {
    STATE.MyRenderEngine = new cookEngine(document.querySelector('#EditPageContainer')!);
    console.log('渲染引擎->', STATE.MyRenderEngine)
    setTimeout(() => {
      STATE.CUR_PAGE && (document.title = 'cooking-' + STATE.CUR_PAGE.title);
    })
  }

  useMount(() => {
    createEngine();
  })
  // 页面改变
  EP.$switchPage.useSubscription((index) => {
    STATE.Panzoom.reset();
    clearFocus();
    createEngine();
  });

  return <div className={styles['edit-screen']} id="EditScreen">
    <div ref={EditMainRef} id="EditPageMain" className={styles['edit-page-main']} style={{ width: SCREEN.width + 'px', minHeight: SCREEN.height + 'px' }}>
      <div ref={EditPageRef} id="EditPageContainer" className={styles['edit-page-container']} style={{ width: SCREEN.width + 'px', minHeight: SCREEN.height + 'px' }}>
        <h1 id="DefaultTip" className={styles['drop-tip']}>请拖动布局</h1>
      </div>
      {lineState.show ? <EditLineBox EditPage={EditPage} lineState={lineState} setLineState={setLineState} /> : null}
    </div>
    <ZoomPlugin target='EditPageMain' />
  </div>
}


export default EditPage;
