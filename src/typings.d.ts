/*
 * @Author: weijundong wx_dda6ed3e7d4049b18953aab41af2bcd1@git.code.tencent.com
 * @Date: 2022-05-20 10:05:32
 * @LastEditors: weijundong wx_dda6ed3e7d4049b18953aab41af2bcd1@git.code.tencent.com
 * @LastEditTime: 2022-06-01 11:23:37
 * @FilePath: \ty-cooking\src\typings.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
declare module 'react-ace';

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.jpg' {
  const jpg: string;
  export default jpg;
}
declare module '*.png' {
  const png: string;
  export default png;
}

interface DBStore {
  id: string;
  page_use: number;
  dom_tree: any;
}

interface Screen {
  width: number;
  height: number;
}

interface ToolTab {
  name: string;
  icon: string;
  event: any;
}

interface DomItem {
  type: string;
  tag: 'div' | 'ul' | 'li' | 'button' | 'span' | 'image' | 'i';
  name: string;
  style: Object<CSSStyleDeclaration>;
  className?: string;
  child?: Array<DomItem>;
  text?: string;
  placeholder?: string;
  hide?: boolean;
  events?: any;
  plugins?: any;
  edit?: any;
  src?: string;
  stopBefore?: boolean;
  stopAfter?: boolean;
  stopAdd?: boolean;
  dragDots?: Array<'left' | 'right' | 'top' | 'bottom'>;
}

interface PageItem {
  type: 'page';
  id: string;
  title: string;
  name?: string;
  style?: Object<CSSStyleDeclaration>;
  child?: Array<DomItem>;
  hide?: boolean;
  events?: any;
  stopBefore?: boolean;
  stopAfter?: boolean;
  stopAdd?: boolean;
  dragDots?: Array<'left' | 'right' | 'top' | 'bottom'>
}
interface DomTree {
  appName: string;
  plugins: Array;
  pages: Array<PageItem>
}


