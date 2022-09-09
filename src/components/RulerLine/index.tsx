import styles from './index.module.less';
import { useSize } from 'ahooks';
// 辅助线
const RulerLine = function () {
  const Screen = useSize(document.querySelector('html'));
  const Line = function (props) {
    const scaleEls: JSX.Element[] = [];
    for (var i = 0; i < props.size; i++) {
      if (i % 10 == 0 && i != 0) {
        let styleObj = props.direction == 'x' ? { left: (i - 1) + 'px', height: i % 50 == 0 ? '100%' : '50%' } : { top: (i - 1) + 'px', width: i % 50 == 0 ? '100%' : '50%' };
        scaleEls.push(<i style={styleObj} key={'y-' + props.direction + i}>{i % 50 == 0 ? <span>{i}</span> : ''}</i>)
      }
    }
    return <div className={styles['ruler-Line'] + ' ' + (props.direction == 'x' ? styles.rulerX : styles.rulerY)}>{scaleEls}</div>;
  }
  return <div id="RulerLine">
    {/* 辅助线-X轴 */}
    <Line size={Screen?.width} direction="x" />
    {/* 辅助线-Y轴 */}
    <Line size={Screen?.height} direction="y" />
  </div>
}

export default RulerLine;
