import styles from './index.module.less';
import { useParams } from 'ice';
import { useMount, useTitle } from 'ahooks';
import cookEngine from '@/ingredients/cookEngine'
import STATE from '@/db/state';

interface pageParam {
  pid: string
}
const Preview = (props) => {
  const params: pageParam = useParams();
  const page = STATE.DOM_DATA.pages[params.pid];
  useTitle('预览-' + page.title);
  useMount(() => {
    cookEngine.preview(page, document.querySelector('#CookPreview')!)
  })
  return <div id="CookPreview" className={styles.cookPreview}> </div>;
};

export default Preview;
