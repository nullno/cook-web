/*
 * @Author: weijundong
 * @Date: 2022-04-19 15:12:59
 * @LastEditors: weijundong
 * @LastEditTime: 2022-05-27 09:33:19
 * @FilePath: \cook-web\src\pages\Home\index.tsx
 */
import { useEventEmitter } from 'ahooks';

import PageBoard from '@/components/PageBoard';

import RulerLine from '@/components/RulerLine';

import ToolBarBox from '@/components/ToolBarBox';

import EditPage from '@/components/EditPage';

const Home = () => {
  const $switchPage = useEventEmitter();
  return <div className="cookApp">
    {/* 页面管理 */}
    <PageBoard $switchPage={$switchPage} />
    {/* 页面编辑容器 */}
    <EditPage $switchPage={$switchPage} />
    {/* 工具栏 */}
    <ToolBarBox />
    {/* 辅助线 */}
    <RulerLine />

  </div>;
};

export default Home;
