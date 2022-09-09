const PageBox1 = {
  type: 'PageBox1',
  name: '模板2',
  tag: 'div',
  stopBefore: true,
  stopAfter: true,
  style: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#F6F6F6',
    overflow: 'hidden'
  },
  child: [
    {
      type: 'PageBox1_head',
      name: '模板2-头部',
      tag: 'div',
      stopBefore: true,
      style: {
        width: '100%',
        height: '50px',
        backgroundColor: '#fff',
        margin: '0 auto',
      },
      child: [],
    },
    {
      type: 'PageBox1_banner',
      name: '模板2-banner',
      tag: 'div',
      style: {
        width: '100%',
        minHeight: '300px',
        backgroundColor: '#EDEDED',
        margin: '10px auto',
        overflow: 'hidden'
      },
      child: [
        {
          type: 'Img',
          name: '图片',
          tag: 'img',
          src: 'https://static.smartisanos.cn/delta/img/01@2x.4d19c6c.jpg?x-oss-process=image/format,webp',
          style: {
            width: '100%',
          },
        }
      ],
    },
    {
      type: 'PageBox1_main',
      name: '模板2-主体',
      tag: 'div',
      style: {
        width: '1200px',
        minHeight: '500px',
        backgroundColor: '#fff',
        margin: '10px auto',
      },
      child: [],
    },
    {
      type: 'PageBox1_footer',
      name: '模板2-底部',
      tag: 'div',
      stopAfter: true,
      style: {
        width: '100%',
        height: '200px',
        backgroundColor: '#fff',
      },
      child: [],
    },
  ],
};
export default PageBox1;
