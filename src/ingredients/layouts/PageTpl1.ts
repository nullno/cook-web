const MangerBox = {
  type: 'MangerBox',
  name: '模板1',
  tag: 'div',
  stopBefore: true,
  stopAfter: true,
  stopAdd: true,
  style: {
    width: '100%',
    minWidth: '1200px',
    minHeight: '500px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    backgroundColor: '#fff',

  },
  child: [
    {
      type: 'MangerBox_head',
      name: '模板1-头部',
      tag: 'div',
      stopBefore: true,
      stopAfter: true,
      dragDots: ['bottom'],
      style: {
        width: '100%',
        height: '60px',
        maxHeight: '100px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        padding: '10px'
      },
      child: [],
    },
    {
      type: 'MangerBox_main',
      name: '模板1-主体',
      tag: 'div',
      stopBefore: true,
      stopAfter: true,
      stopAdd: true,
      style: {
        width: '100%',
        height: '100%',
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        backgroundColor: '#F6F6F6',
      },
      child: [
        {
          type: 'MangerBox_left',
          name: '模板1-侧边栏',
          tag: 'div',
          stopBefore: true,
          stopAfter: true,
          dragDots: ['right'],
          style: {
            width: '100px',
            height: '99%',
            overflow: 'auto',
            backgroundColor: '#fff',
            marginTop: '10px',
            padding: '10px'
          },
          child: [],
        },
        {
          type: 'MangerBox_right',
          name: '模板1-内容',
          tag: 'div',
          stopBefore: true,
          stopAfter: true,
          style: {
            flex: 1,
            width: '98%',
            height: '99%',
            overflow: 'auto',
            marginLeft: '10px',
            marginTop: '10px',
            backgroundColor: '#fff',
            padding: '10px'
          },
          child: [],
        }
      ],

    }
  ],
};

export default MangerBox;
