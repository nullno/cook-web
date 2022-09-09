import styles from './index.module.less';
import STATE from '@/db/state';
import useDB from '@/db/use';
import { useRef, useEffect } from 'react';

import { Tag, Button, message } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
// ace代码编辑器
import AceEditor from 'react-ace';


const ActionPanel = (props) => {
  const aceCodeEditRef = useRef(null);
  const curWidget: DomItem = STATE.DOM_MAP[STATE.CUR_KEY];

  // useEffect(()=>{})
  let aceEditorValue = '';

  const saveEventCode = () => {
    if (curWidget.events === aceEditorValue) return;
    curWidget.events = aceEditorValue;
    useDB.updateStore();
    message.success('保存成功！');
  }
  return <div className={styles['edit-action-panel']}>
    <div className={styles['action-tit']}>
      <Tag icon={<EnvironmentOutlined />} color="#f50">{STATE.CUR_KEY}</Tag>
      <Button type="primary" size='small' onClick={saveEventCode}>保存</Button>
    </div>

    <div id="AceCodeEditRef" ref={aceCodeEditRef} className={styles['edit-action-code']}>
      <AceEditor
        mode="javascript"
        theme="monokai"
        onChange={(value) => aceEditorValue = value}
        value={curWidget.events || `var ${curWidget.className}  = document.querySelector('.${curWidget.className}');`}
        name="UNIQUE_ID_JS_CODE"
        showGutter={true}
        fontSize={16}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          useWorker: false,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>

  </div>
}
export default ActionPanel;
