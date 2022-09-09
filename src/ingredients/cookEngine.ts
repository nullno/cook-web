import { deepCopyObj } from '@/utils/tool'
import STATE from '@/db/state';
import useDB from '@/db/use';

import exportCode from './export/index';

interface exportData {
  html: string;
  css: string;
  js: string;
  img: { id?: string, data?: string };
}
interface previewData {
  js: string;
}


const Util = {
  Typeof(data, type) {
    return Object.prototype.toString.call(data) === '[object ' + type + ']';
  },
  FlitterImgUrl(str) {
    if (!str) return '';
    let regBackgroundUrl = /url\("?'?.*"?'?\)/g;
    let regReplace = /"|'|url|\(|\)/g;
    return str.match(regBackgroundUrl)[0].replace(regReplace, '')
  },
  IsImgBase64(str) {
    if (!str) return false;
    return str.includes('base64,');
  },
  FormatCssKey(str) {
    return str.replace(/([a-zA-Z])([A-Z])/g, '$1-$2').toLowerCase();
  },
  CompareRemove(data, compare) {
    if (this.Typeof(data, 'Array') && compare) {
      for (var i = 0; i < data.length; i++) {
        (function (index) {
          if ((compare['a'] ? data[index][compare['a']] : data[index]) == compare['b']) {
            data.splice(index, 1);
            i--;
          }
        })(i)
      }
    }
  }
};

export class CoreHandler {
  constructor(el: HTMLDivElement) {
    this.$root = el;
  }
  $root: HTMLDivElement;
  // 自定义前缀
  static prefix: string = 'C_';
  // 引擎自增id
  static cacheId: number = 1;
  // 唯一类名放冲突
  static testHashName: string = '';
  static extendEventHandler(e: DomItem, isType: string,) {

  }
  // domData处理
  static _domHandler(e: DomItem, isType: string, exd?: exportData): DocumentFragment {
    const tempFragments: DocumentFragment = document.createDocumentFragment();
    let tempDom = document.createElement(e.tag);
    const key = e.className || CoreHandler.prefix + CoreHandler._makeHashName(e.type);
    let classNameStr = key;
    if (e.type === 'Img') {
      tempDom.setAttribute('src', e.src!)
    }
    // 元素开启编辑处理
    if ('Button,Text'.includes(e.type)) {
      tempDom.innerText = e.text || '文本';
      // 设置可编辑
      if (isType === 'dev') {
        !tempDom.className.includes('panzoom-exclude') && (classNameStr += ' panzoom-exclude');
        tempDom.setAttribute('contenteditable', "true");
        tempDom.setAttribute('canEdit', "true");
        tempDom.addEventListener("blur", function () {
          console.log("contenteditable changed");
          e.text = tempDom.innerText;
          useDB.updateStore();
        });

      }
    }

    // 文本输入处理
    if ('Input,Textarea'.includes(e.type)) {
      e.placeholder && tempDom.setAttribute('placeholder', e.placeholder);
      // 设置可编辑
      if (isType === 'dev') {
        !tempDom.className.includes('panzoom-exclude') && (classNameStr += ' panzoom-exclude');
        tempDom.setAttribute('canEdit', "true");
      }
    }
    // 样式处理
    if (isType !== 'export') {
      Object.assign(tempDom.style, e.style);
    }
    // 预览事件处理
    if (isType === 'preview') {
      tempDom.className = key;
      if (exd && e.events) {
        exd.js += CoreHandler._exportJsHandler(e.events);
      }
    }
    // 导出
    if (isType === 'export' && exd) {
      tempDom.className = key;
      exd.css += CoreHandler._exportCssHandler(key, e.style, exd);
      exd.js += CoreHandler._exportJsHandler(e.events);
    }

    // 编辑环境
    if (isType === 'dev') {
      tempDom.className = classNameStr;
      tempDom.setAttribute('key', key);
      e.className = key;
      STATE.DOM_MAP[key] = e;
    }

    tempFragments.appendChild(tempDom);

    if (e.child && e.child.length > 0) {
      e.child.forEach(n => {
        tempDom.appendChild(CoreHandler._domHandler(n, isType, exd))
      })
    }

    return tempFragments;
  }
  // 导出样式处理
  static _exportCssHandler(className: string, style: CSSStyleDeclaration, exd: exportData): string {
    let tempCss = '';
    for (let key in style) {
      let val = style[key] ? style[key].toString() : '';
      if (Util.IsImgBase64(val)) {
        const imgName = (((1 + Math.random()) * 0x10000000) | 0).toString(10);
        let ext = val.includes('data:image/jpeg') ? '.jpg' : '.png';
        val = `url(../images/${imgName + ext})`;
        exd.img[imgName + ext] = Util.FlitterImgUrl(style[key]);
      }
      // 脏图片数据处理
      val = val.includes('data:') ? '' : val;
      tempCss += `${Util.FormatCssKey(key)}:${val};`;
    }
    return `.${className}{${tempCss}}\n`;
  }
  // 导出js处理
  static _exportJsHandler(events: string) {
    if (!events) return '';
    // 事件转义
    return `${events}\n\n`;
  }
  // 导出源码处理
  static _exportPageHandler(page: PageItem): exportData {
    const tempRoot: HTMLDivElement = document.createElement('div');
    const exportData = { html: '', css: '', js: '', img: {} };
    page.child && page.child.forEach(e => {
      tempRoot.appendChild(CoreHandler._domHandler(e, 'export', exportData));
    });
    exportData.html = tempRoot.innerHTML;
    return exportData;
  }
  // 预览
  static preview(page: PageItem, target): void {
    if (!page.child) return;
    const previewData = { html: '', css: '', js: '', img: {} };
    page.child.forEach(e => {
      target.appendChild(CoreHandler._domHandler(e, 'preview', previewData))
    });
    // 事件处理
    const script = document.createElement('script');
    script.id = 'event_' + page.id;
    script.innerHTML = previewData.js;
    document.body.appendChild(script);

  }
  // 生成类名
  static _makeHashName(type): string {
    let hashName = type + '_' + (((1 + Math.random()) * 0x10000000) | 0).toString(16);
    hashName = !CoreHandler.testHashName.includes(hashName) ? hashName : hashName + 'x2';
    CoreHandler.testHashName += hashName + '/';
    return hashName;
  }
  // 开发模式-生成Dom节点
  _makeDom(e: DomItem): DocumentFragment {
    return CoreHandler._domHandler(e, 'dev');
  }
  // 删除Dom节点
  _delDom(p: DomItem | PageItem, t: string): void {
    p.child && Util.CompareRemove(p.child, { a: 'className', b: t })
  }
  // 更新节点
  _updateDom(dom) {
    let styleObject = {};
    for (const key in STATE.DOM_MAP[STATE.CUR_KEY].style) {
      if (Object.prototype.hasOwnProperty.call(STATE.DOM_MAP[STATE.CUR_KEY].style, key)) {
        const element = STATE.DOM_MAP[STATE.CUR_KEY].style[key];
        if (element !== undefined) {
          styleObject[key] = ['px'].indexOf(element) >= 0 ? '' : element;
        } else {
          styleObject[key] = '';
        }
      }
    }
    Object.assign(dom.style, styleObject);
  }
  // 清空编辑框
  _clearAll() {
    this.$root.innerHTML = '';
  }

}

export default class cookEngine extends CoreHandler {
  constructor(el: HTMLDivElement) {
    super(el);
    this.$root = el;
    this.name = 'cookEngine-' + cookEngine.cacheId;
    cookEngine.cacheId++;
    this.init();
  }
  name: string;
  $root: HTMLDivElement;
  init() {
    // @ts-ignore
    const pChild = STATE.CUR_PAGE.child;
    if (!pChild) return;
    this._clearAll();
    pChild.forEach(e => {
      this.$root.appendChild(this._makeDom(e))
    });

  }
  // 新增
  add(e: DomItem, mapKey?: string): void {
    const newDom = this._makeDom(e);
    if (!mapKey) {
      STATE.CUR_PAGE?.child?.push(e);
      this.$root.appendChild(newDom)
      useDB.updateStore();
      return;
    }
    const useWidget = STATE.DOM_MAP[mapKey];
    if (useWidget && useWidget.stopAdd) return;
    if (useWidget.child) {
      const cuSet = useWidget.child;
      cuSet.push(e);
      const curDom = document.querySelector('.' + mapKey) as HTMLElement;
      curDom.appendChild(newDom)
    }
    useDB.updateStore();
  }
  // 插入
  insert(t: 'before' | 'after', e: DomItem, mapKey: string): void {
    const newDom = this._makeDom(e);
    const curDom = document.querySelector('.' + mapKey) as HTMLElement;

    let parentNode = curDom.parentNode as HTMLDivElement;
    let pMapKey = parentNode.getAttribute('key') || '';
    let cuSet: Array<DomItem> = [];
    if (!pMapKey.includes(cookEngine.prefix)) {
      parentNode = this.$root;
      cuSet = STATE.CUR_PAGE?.child!;
    } else {
      const useWidget = STATE.DOM_MAP[pMapKey];
      if (useWidget.stopAdd) return;
      cuSet = useWidget.child || [];
    }

    let fdx = cuSet.findIndex(item => item.className === mapKey);
    if (fdx === -1) return;
    if (t === 'before') {
      cuSet.splice(fdx - 1, 0, e);
      parentNode.insertBefore(newDom, curDom);
    }
    if (t === 'after') {
      cuSet.splice(fdx + 1, 0, e);
      !curDom.nextSibling ? parentNode.appendChild(newDom) : parentNode.insertBefore(newDom, curDom.nextSibling)
    }
    useDB.updateStore();
  }
  // 删除
  remove(el: HTMLDivElement) {
    const mapKey = el.getAttribute('key') || '';
    // @ts-ignore
    const pMapKey = el.parentNode.getAttribute('key') || '';
    if (pMapKey.includes(cookEngine.prefix)) {
      const curItem = STATE.DOM_MAP[pMapKey];
      curItem && this._delDom(curItem, mapKey);
      delete STATE.DOM_MAP[mapKey];
    } else {
      STATE.CUR_PAGE && this._delDom(STATE.CUR_PAGE, mapKey);
    }
    el.remove();
    useDB.updateStore();
  }
  // 克隆
  clone(el: HTMLDivElement) {
    const mapKey = el.getAttribute('key') || '';
    const curItem = STATE.DOM_MAP[mapKey];
    if (!curItem) return;
    const newItem = deepCopyObj(curItem);
    (function removeClass(item) {
      delete item.className;
      if (item.child && item.child.length > 1) {
        item.child.forEach(n => removeClass(n));
      }
    })(newItem)
    // @ts-ignore
    this.insert('after', newItem, mapKey)
  }
  // 修改（样式，绑定数据，事件等）
  modify(newStyle: CSSStyleDeclaration) {
    Object.assign(STATE.DOM_MAP[STATE.CUR_KEY].style, newStyle);
    this._updateDom(STATE.CUR_EL);
    useDB.updateStore();
  }
  //打包输出源码
  download() {
    exportCode(STATE, CoreHandler);
  }
}

