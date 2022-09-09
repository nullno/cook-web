import styles from './index.module.less';
import { useMount, useKeyPress, useEventEmitter } from 'ahooks';
import { Popconfirm, Popover } from 'antd';
import StylePanel from './StylePanel';
import ActionPanel from './ActionPanel';
import drag from '@/utils/drag'
import STATE from '@/db/state';

// 是否等比
let isEqualRatio = false;
// 添加尺寸拖动
const addDragSizeEvent = function (dragDots, setLineState, EditPage) {
  dragDots.map((item) => {
    const useDom = STATE.CUR_EL as HTMLDivElement;
    const useWidget = STATE.DOM_MAP[STATE.CUR_KEY]
    const DragDotEl: HTMLDivElement = document.querySelector('#dot-drag-' + item)!;
    let OriginHeight = useDom.offsetHeight;
    let OriginWidth = useDom.offsetWidth;
    let ratio = OriginHeight / OriginWidth;
    new drag(DragDotEl, {
      disableX: !'left,right'.includes(item),
      disableY: !'top,bottom'.includes(item),
      onchange(pos) {
        const tempSize = {
          width: useWidget.style.width,
          height: useWidget.style.height
        };

        DragDotEl.style.top = DragDotEl.style.left = '0px';

        if (useDom.clientWidth < 5 || useDom.clientHeight < 5) return;

        // 正常模式
        if (!isEqualRatio) {
          if (this.option.disableX) {
            tempSize.height = (OriginHeight + ('bottom'.includes(item) ? + pos.y : -pos.y)) + 'px'
            // useDom.style.height = (OriginHeight + ('bottom'.includes(item) ? + pos.y : -pos.y)) + 'px';
            // useWidget.style.height = useDom.style.height;
          }
          if (this.option.disableY) {
            tempSize.width = (OriginWidth + ('right'.includes(item) ? +pos.x : -pos.x)) + 'px';
            // useDom.style.width = (OriginWidth + ('right'.includes(item) ? +pos.x : -pos.x)) + 'px';
            // useWidget.style.width = useDom.style.width;
          }

        }
        // 等比模式
        if (isEqualRatio) {
          if (this.option.disableX) {
            const h = OriginHeight + pos.y;
            tempSize.height = h + 'px';
            tempSize.width = h / ratio + 'px';
            // useDom.style.height = h + 'px';
            // useDom.style.width = h / ratio + 'px';
          }
          if (this.option.disableY) {

            const w = OriginWidth + pos.x;
            tempSize.width = w + 'px';
            tempSize.height = w * ratio + 'px';
            // useDom.style.width = w + 'px';
            // useDom.style.height = w * ratio + 'px';
          }
          // useWidget.style.height = useDom.style.height;
          // useWidget.style.width = useDom.style.width;
        }
        STATE.MyRenderEngine.modify(tempSize);
        setLineState({
          style: {
            width: (useDom.offsetWidth) + 'px',
            height: (useDom.offsetHeight) + 'px',
            top: (useDom.offsetTop - EditPage.scrollTop) + 'px',
            left: (useDom.offsetLeft - EditPage.scrollLeft) + 'px'
          }
        })

      }
    })
  })
}

// 聚焦编辑线
const EditLineBox = (props) => {
  const { lineState, setLineState, EditPage } = props;
  const curWidget = STATE.DOM_MAP[lineState.mapKey];
  const showAddBefore = curWidget && curWidget.child && !curWidget.stopBefore;
  const showAddAfter = curWidget && curWidget.child && !curWidget.stopAfter;
  // 键盘监听-按住shift保持等比缩放
  useKeyPress(['shift'], (event) => {
    isEqualRatio = event.type === 'keydown';
  }, {
    events: ['keydown', 'keyup'],
  });

  // 编辑节点动作
  const optionsAction = (e): void => {
    switch (e.id) {
      case 'del':
        STATE.MyRenderEngine.remove(STATE.CUR_EL);
        setLineState({ show: false });
        break;
      case 'copy':
        STATE.MyRenderEngine.clone(STATE.CUR_EL)
        break;
    }
  }
  // window.onresize = () => {
  //   (lineState.show && STATE.CUR_EL) && setLineState({
  //     style: {
  //       width: (STATE.CUR_EL.clientWidth + 2) + 'px',
  //       height: (STATE.CUR_EL.clientHeight + 2) + 'px',
  //       top: (STATE.CUR_EL.offsetTop - EditPage.scrollTop) + 'px',
  //       left: (STATE.CUR_EL.offsetLeft - EditPage.scrollLeft) + 'px'
  //     }
  //   })
  // }
  useMount(() => {
    curWidget.dragDots && addDragSizeEvent(curWidget.dragDots, setLineState, EditPage);
  })

  return <div id="EditLineBox" className={styles['edit-line-box']} style={lineState.style}>
    {curWidget.dragDots && curWidget.dragDots.map((item, index) => <i key={'drag-' + index} className={'panzoom-exclude ' + styles['line-dot'] + ' ' + styles['line-dot-' + item]}><div id={'dot-drag-' + item} className={styles['dot-drag']}><span></span></div></i>)}
    <div className={styles['edit-option']}>
      <Popconfirm title="确定删除此节点?" okText="确定" cancelText="取消" onConfirm={() => optionsAction({ id: 'del' })}>
        <button key={'opt-del'} className={styles['edit-btn']} title="移除元素"><i className={"fa fa-trash"}></i></button>
      </Popconfirm>
      <button key={'opt-copy'} className={styles['edit-btn']} title="复制" onClick={() => optionsAction({ id: 'copy' })}><i className={"fa fa-copy"}></i></button>
      <Popover
        placement="bottomLeft"
        content={<StylePanel />}
        title="定制样式"
        trigger="click"
        className='ant-pop'
      >
        <button key={'opt-style'} className={styles['edit-btn']} title="定制样式" ><i className={"fa fa-edit"}></i></button>
      </Popover>
      <Popover
        placement="bottomLeft"
        content={<ActionPanel />}
        title="动作交互"
        trigger="click"
        className='ant-pop'
      >
        <button key={'opt-active'} className={styles['edit-btn']} title="动作"><i className={"fa fa-sliders"}></i></button>
      </Popover>
      <button key={'opt-setting'} className={styles['edit-btn']} title="高级设置"><i className={"fa fa-cog"}></i></button>
      <div className={styles.directive}>
        {curWidget && curWidget.name}
      </div>
    </div>
    {
      showAddBefore ? <div className={styles['insert-box-top']} data-key={lineState.mapKey} data-pos="before">
        此元素前添加
      </div> : null
    }
    {
      showAddAfter ? <div className={styles['insert-box-bottom']} data-key={lineState.mapKey} data-pos="after">
        此元素后添加
      </div> : null
    }
  </div >
}

export default EditLineBox;
