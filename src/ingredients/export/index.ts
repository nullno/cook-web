import { message } from 'antd';
import resetCssTemplate from './resetCssTemplate'
import htmlTemplate from './htmlTemplate';
import cssTemplate from './cssTemplate';
import jsTemplate from './jsTemplate';

export default function (STATE, CoreHandler) {
  const loadHide = message.loading('正在导出源码..', 0);
  // @ts-ignore
  const zip = new JSZip();
  const cookerFiles: any = zip.folder(".cooker");
  const imgFiles: any = zip.folder("images");
  const cssFiles = zip.folder("css");
  const jsFiles = zip.folder("js");
  cookerFiles.file("cooker." + Date.now() + ".json", JSON.stringify(STATE.DOM_DATA.pages));
  cssFiles.file("normalize.css", resetCssTemplate());
  STATE.DOM_DATA.pages.forEach(page => {
    const exportData = CoreHandler._exportPageHandler(page);
    // console.log(exportData);
    // img file
    for (let key in exportData.img) {
      const imgData = exportData.img[key];
      imgFiles.file(key, imgData.substring(imgData.indexOf(',') + 1), { base64: true });
    }
    // js file
    jsFiles.file(page.id + '.js', jsTemplate(page, exportData.js));
    // css file
    cssFiles.file(page.id + '.css', cssTemplate(page, exportData.css));
    // html file
    zip.file(page.id + '.html', htmlTemplate(page, exportData.html));

  })
  zip.generateAsync({ type: "blob" })
    .then((content) => {
      // @ts-ignore see FileSaver.js
      saveAs(content, 'cook-web.zip');
      loadHide();
      message.success('导出成功！');

    }).catch((err) => {
      loadHide();
      message.error('导出失败:【' + err + '】');
    })
}
