interface ViewState {
  disableMove: boolean;
}

import styles from './index.module.less';
import { useMount, useSetState, useFullscreen } from 'ahooks'
import STATE from '@/db/state';

let myPanzoom: any;

const ZoomPlugin = (props) => {

  const [viewState, setViewState] = useSetState<ViewState>({
    disableMove: false,
  });
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(() => document.body);

  useMount(() => {
    const EditPageEl: HTMLDivElement = document.querySelector('#' + props.target)!;
    // @ts-ignore
    myPanzoom = Panzoom(EditPageEl, { startScale: 0.9, disablePan: viewState.disableMove });
    // @ts-ignore
    EditPageEl.addEventListener('wheel', (event: any) => {
      if (!event.ctrlKey) return;
      myPanzoom.zoomWithWheel(event)
    })
    STATE.Panzoom = myPanzoom;
  })
  const setZoom = (f: string) => {
    if (f === 'add') {
      myPanzoom && myPanzoom.zoomIn();
    }
    if (f === 'minus') {
      myPanzoom && myPanzoom.zoomOut();
    }
  }

  const openMove = () => {
    const { disablePan } = myPanzoom.getOptions();
    setViewState({
      disableMove: !disablePan
    })
    myPanzoom.setOptions({ disablePan: !disablePan })
  }

  return <div className={styles['zoom-view']}>
    <i title="平移" className={'fa fa-mouse-pointer ' + (!viewState.disableMove ? styles.active : '')} onClick={openMove}></i>
    <i title="全屏" className="fa fa-arrows-alt" onClick={toggleFullscreen}></i>
    <i title="重置" className="fa fa-crosshairs" onClick={() => myPanzoom.reset()}></i>
    <i title="放大" className="fa fa-plus-square" onClick={() => setZoom('add')}></i>
    <i title="缩小" className="fa fa-minus-square" style={{ marginBottom: '50px' }} onClick={() => setZoom('minus')}></i>
    <i title="预览" className="fa fa-eye" onClick={() => {
      window.open(location.protocol + '//' + location.host +location.pathname+ '#/preview/' + STATE.PAGE_USE);
    }}></i>
    <i title="下载源码" className="fa fa-cloud-download" onClick={() => {
      STATE.MyRenderEngine.download();
    }}></i>
  </div>

}
export default ZoomPlugin;
