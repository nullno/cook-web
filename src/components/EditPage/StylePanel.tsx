import styles from './index.module.less';
import { useSetState } from 'ahooks';
import { Space, Input, Select, Slider, Radio } from 'antd';
import { CodepenOutlined } from '@ant-design/icons';
import UploadImg from './UploadImg';

import STATE from '@/db/state';
import { styleObjectToCodeString, styleCodeStringToObject, styleObjectUndefined } from '@/utils/styleFormat';
// ace代码编辑器
import AceEditor from 'react-ace';

const { Option } = Select;
const Util = {
  FlitterNumber(str) {
    if (str === 'auto' || !str) {
      return '';
    }
    const n = parseFloat(str);
    return isNaN(n) ? '' : n;
  },
  FlitterUnit(str) {
    const res = this.FlitterNumber(str);
    return res == '' ? 'px' : str.replace(this.FlitterNumber(str), '');
  },
  FlitterImgUrl(str) {
    if (!str) return '';
    let regBackgroundUrl = /url\("?'?.*"?'?\)/g;
    let regReplace = /"|'|url|\(|\)/g;
    return str.match(regBackgroundUrl)[0].replace(regReplace, '');
  },
  IsImgBase64(str) {
    if (!str) return false;
    return str.includes('base64,');
  },
  BgPos(str) {
    if (str === 'cover') {
      return 'full';
    }
    if (str === 'unset') {
      return 'repeat';
    }
    if (str === 'contain') {
      return 'center';
    }
    return '';
  },
};

const sizeArr = [
  { text: '宽', key: 'width' },
  { text: '高', key: 'height' },
  { text: '最小宽', key: 'minWeight', disableAuto: true },
  { text: '最大宽', key: 'maxWeight', disableAuto: true },
  { text: '最小高', key: 'minHeight', disableAuto: true },
  { text: '最大高', key: 'maxHeight', disableAuto: true },
];
const directionArr = [
  { text: '上', key: 'Top', key2: 'top' },
  { text: '右', key: 'Right', key2: 'right' },
  { text: '下', key: 'Bottom', key2: 'bottom' },
  { text: '左', key: 'Left', key2: 'left' },
];

const angleArr = [
  { text: '上左', key: 'TopLeft' },
  { text: '上右', key: 'TopRight' },
  { text: '下右', key: 'BottomRight' },
  { text: '下左', key: 'BottomLeft' },
];

const StylePanel = (props) => {
  const curWidget = STATE.DOM_MAP[STATE.CUR_KEY];
  const [useStyle, setUseStyle] = useSetState({ ...curWidget.style });
  // console.log(useStyle)
  const [styleCode, setStyleCode] = useSetState({ string: '' });
  const [edit, setEdit] = useSetState({ is: false });

  // 样式对象转换成样式字符串
  const ObjectToCode = (style) => {
    let styleCodeString = styleObjectToCodeString(style);
    setStyleCode({ string: styleCodeString });
  };
  // 样式字符串转成样式对象
  const CodeToObject = (pStyleCodeString) => {
    let styleObj = styleCodeStringToObject(pStyleCodeString);
    let useStyleObject = styleObjectUndefined(useStyle, styleObj);
    setUseStyle(useStyleObject);
    STATE.MyRenderEngine.modify(useStyleObject);
  };
  const UnitSelect = (p) => {
    return (
      <Select ref={p.ref} defaultValue={p.v || 'px'} className="select-after" onChange={(e) => p.onChange(e)}>
        <Option value="px">px</Option>
        <Option value="rem">rem</Option>
        <Option value="%">%</Option>
        {!p.disableAuto ? <Option value="auto">auto</Option> : null}
      </Select>
    );
  };

  const updateStyle = {
    size(key, v, u) {
      const temp = {};
      temp[key] = v + u;
      setUseStyle(temp);
      STATE.MyRenderEngine.modify(temp);
    },
    bg(key, v) {
      let temp = {};
      if (key != 'type') {
        temp[key] = v;
      } else {
        switch (v) {
          case 'full':
            temp = {
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            };
            break;
          case 'repeat':
            temp = {
              backgroundRepeat: 'repeat',
              backgroundSize: 'unset',
              backgroundPosition: 'normal',
            };
            break;
          case 'center':
            temp = {
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
            };
            break;
        }
      }
      setUseStyle(temp);
      STATE.MyRenderEngine.modify(temp);
    },
    direction(key, v, n?) {
      const temp = {};
      temp[key] = v + (!n ? 'px' : '');
      setUseStyle(temp);
      STATE.MyRenderEngine.modify(temp);
    },
    base(key, v) {
      const temp = {};
      temp[key] = v;
      setUseStyle(temp);
      STATE.MyRenderEngine.modify(temp);
    },
  };
  return (
    <div className={styles['edit-style-panel']}>
      <div
        title="编辑/代码"
        className={styles['change-edit-btn']}
        onClick={() => {
          setEdit({ is: !edit.is });
          ObjectToCode(useStyle);
        }}
      >
        <CodepenOutlined />
        {/* <span className={styles['edit-object']}>object</span>/<span className={styles['edit-object']}>code</span> */}
      </div>
      {edit.is ? (
        <div>
          <AceEditor
            className={styles['edit-content']}
            mode="css"
            theme="monokai"
            onChange={(value) => {
              setStyleCode({ string: value });
              CodeToObject(value);
            }}
            value={styleCode.string}
            name="UNIQUE_ID_CSS_CODE"
            fontSize={16}
            showGutter={false}
            setOptions={{
              useWorker: false,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
            }}
            style={{ width: '100%', height: '400px' }}
          />
        </div>
      ) : (
        <Space direction="vertical">
          <label className={styles['label-title']}>尺寸</label>
          <Input.Group compact>
            {sizeArr.map((item) => (
              <Input
                key={item.key}
                prefix={item.text + ':'}
                style={{ width: '45%', margin: '5px' }}
                value={Util.FlitterNumber(useStyle[item.key])}
                addonAfter={
                  <UnitSelect
                    v={Util.FlitterUnit(useStyle[item.key])}
                    disableAuto={item.disableAuto}
                    onChange={(e) => {
                      updateStyle.size(item.key, Util.FlitterNumber(useStyle[item.key]), e);
                    }}
                  />
                }
                type="number"
                onChange={(e) => {
                  updateStyle.size(item.key, e.target.value, Util.FlitterUnit(useStyle[item.key]));
                }}
              />
            ))}
          </Input.Group>
          <label className={styles['label-title']}>背景</label>
          <Input.Group compact>
            <Input
              prefix="背景色:"
              style={{ width: '48%', marginRight: '10px' }}
              defaultValue={useStyle.backgroundColor || '#ffffff'}
              type="color"
              onBlur={(e) => {
                updateStyle.bg('backgroundColor', e.target.value);
              }}
            />
            <Input
              prefix="自定义:"
              style={{ width: '48%' }}
              defaultValue={useStyle.backgroundColor}
              onBlur={(e) => {
                updateStyle.bg('backgroundColor', e.target.value);
              }}
            />
            <div className={styles['input-item']} style={{ width: '100%', marginTop: '10px' }}>
              <label style={{ float: 'left', padding: '5px' }}>透明度:</label>
              <Slider
                style={{ width: '80%', float: 'left' }}
                defaultValue={1}
                min={0}
                max={1}
                step={0.1}
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </div>
            <Input
              prefix="图片链接:"
              style={{ width: '100%', marginBottom: '10px' }}
              value={Util.FlitterImgUrl(useStyle.backgroundImage)}
              onChange={(e) => {
                updateStyle.bg('backgroundImage', `url(${e.target.value})`);
              }}
            />
            <Radio.Group
              style={{ marginBottom: '10px' }}
              value={Util.BgPos(useStyle.backgroundSize)}
              options={[
                { label: '铺满', value: 'full' },
                { label: '平铺', value: 'repeat' },
                { label: '居中', value: 'center' },
              ]}
              onChange={(e) => {
                updateStyle.bg('type', e.target.value);
              }}
              optionType="button"
            />
            <UploadImg
              defaultValue={
                Util.IsImgBase64(useStyle.backgroundImage) ? Util.FlitterImgUrl(useStyle.backgroundImage) : ''
              }
              onChange={(e) => {
                updateStyle.bg('backgroundImage', `url(${e})`);
              }}
            />
          </Input.Group>
          <Input.Group compact></Input.Group>
          <label className={styles['label-title']}>显示方式(display)</label>
          <Input.Group compact>
            <div className={styles['input-item']} style={{ width: '50%' }}>
              <label>行/块:</label>
              <Select
                style={{ width: '50%' }}
                defaultValue={useStyle.display}
                className="select-after"
                onChange={(e) => {
                  updateStyle.base('display', e);
                }}
              >
                <Option value="unset">unset</Option>
                <Option value="inline">inline</Option>
                <Option value="block">block</Option>
                <Option value="inline-block">inline-block</Option>
                <Option value="flex">flex</Option>
                <Option value="inherit">inherit</Option>
              </Select>
            </div>
            <div className={styles['input-item']} style={{ width: '50%' }}>
              <label>溢出:</label>
              <Select
                style={{ width: '50%' }}
                defaultValue={useStyle.overflow}
                className="select-after"
                onChange={(e) => {
                  updateStyle.base('overflow', e);
                }}
              >
                <Option value="unset">unset</Option>
                <Option value="visible">visible</Option>
                <Option value="hidden">hidden</Option>
                <Option value="auto">auto</Option>
                <Option value="scroll">scroll</Option>
              </Select>
            </div>
          </Input.Group>
          <label className={styles['label-title']}>浮动方向(float)</label>
          <Input.Group compact>
            <Select
              style={{ width: '50%' }}
              defaultValue={useStyle.float}
              className="select-after"
              onChange={(e) => {
                updateStyle.base('float', e);
              }}
            >
              <Option value="none">none</Option>
              <Option value="left">left</Option>
              <Option value="right">right</Option>
              <Option value="inherit">inherit</Option>
            </Select>

            <label className={styles['label-title']}>位置</label>
            <Input.Group compact>
              <div className={styles['input-item']} style={{ width: '35%' }}>
                <label>横向:</label>
                <Select defaultValue="center" className="select-after">
                  <Option value="center">居中</Option>
                  <Option value="left">居左</Option>
                  <Option value="right">居右</Option>
                </Select>
              </div>
              <div className={styles['input-item']} style={{ width: '35%' }}>
                <label>纵向:</label>
                <Select defaultValue="center" className="select-after">
                  <Option value="center">居中</Option>
                  <Option value="left">居顶</Option>
                  <Option value="right">居低</Option>
                </Select>
              </div>
            </Input.Group>
          </Input.Group>
          <label className={styles['label-title']}>定位(position)</label>
          <Input.Group compact>
            <Select
              style={{ width: '50%' }}
              defaultValue={useStyle.position}
              className="select-after"
              onChange={(e) => {
                updateStyle.base('position', e);
              }}
            >
              <Option value="static">static</Option>
              <Option value="relative">relative</Option>
              <Option value="fixed">fixed</Option>
              <Option value="absolute">absolute</Option>
              <Option value="sticky">sticky</Option>
            </Select>
          </Input.Group>
          <label>距离：</label>
          <Input.Group compact>
            {directionArr.map((item) => (
              <Input
                key={item.key2}
                prefix={item.text + ':'}
                style={{ width: '45%', margin: '5px' }}
                defaultValue={useStyle[item.key2]}
                onBlur={(e) => {
                  updateStyle.base(item.key2, e.target.value);
                }}
              />
            ))}
          </Input.Group>

          <label className={styles['label-title']}>文本</label>
          <Input.Group compact>
            <Input
              prefix="颜色:"
              style={{ width: '30%', marginRight: '10px' }}
              defaultValue={useStyle['color']}
              type="color"
              onBlur={(e) => {
                updateStyle.base('color', e.target.value);
              }}
            />
            <Input
              prefix="尺寸:"
              style={{ width: '30%', marginRight: '10px' }}
              defaultValue={Util.FlitterNumber(useStyle['fontSize'])}
              suffix="px"
              type="number"
              onBlur={(e) => {
                updateStyle.base('fontSize', e.target.value + 'px');
              }}
            />
            <Input
              prefix="行高:"
              style={{ width: '30%' }}
              defaultValue={Util.FlitterNumber(useStyle['lineHeight'])}
              suffix="px"
              type="number"
              onBlur={(e) => {
                updateStyle.base('lineHeight', e.target.value + 'px');
              }}
            />
            <div className={styles['input-item']} style={{ width: '50%' }}>
              <label>横向:</label>
              <Select
                style={{ width: '70%' }}
                defaultValue={useStyle.textAlign}
                className="select-after"
                onChange={(e) => {
                  updateStyle.base('textAlign', e);
                }}
              >
                <Option value="center">center</Option>
                <Option value="left">left</Option>
                <Option value="right">right</Option>
              </Select>
            </div>
            <div className={styles['input-item']} style={{ width: '50%' }}>
              <label>纵向:</label>
              <Select
                style={{ width: '64%' }}
                defaultValue={useStyle.verticalAlign}
                className="select-after"
                onChange={(e) => {
                  updateStyle.base('verticalAlign', e);
                }}
              >
                <Option value="baseline">baseline</Option>
                <Option value="middle">middle</Option>
                <Option value="top">top</Option>
                <Option value="bottom">bottom</Option>
                <Option value="text-top">text-top</Option>
                <Option value="text-bottom">text-bottom</Option>
                <Option value="inherit">inherit</Option>
              </Select>
            </div>
          </Input.Group>
          <label className={styles['label-title']}>边距</label>
          <label>综合:</label>
          <Input.Group compact>
            <Input
              prefix="外边距:"
              style={{ width: '48%', marginRight: '10px' }}
              suffix="px"
              type="number"
              defaultValue={Util.FlitterNumber(useStyle.margin)}
              onChange={(e) => {
                updateStyle.direction('margin', e.target.value);
              }}
            />
            <Input
              prefix="内边距:"
              style={{ width: '48%' }}
              suffix="px"
              type="number"
              defaultValue={Util.FlitterNumber(useStyle.padding)}
              onChange={(e) => {
                updateStyle.direction('padding', e.target.value);
              }}
            />
          </Input.Group>
          <label>外边距:</label>
          <Input.Group compact>
            {directionArr.map((item) => (
              <Input
                key={item.key}
                style={{ width: '25%' }}
                prefix={item.text}
                suffix="px"
                type="number"
                defaultValue={Util.FlitterNumber(useStyle['margin' + item.key])}
                onChange={(e) => {
                  updateStyle.direction('margin' + item.key, e.target.value);
                }}
              />
            ))}
          </Input.Group>
          <label>内边距:</label>
          <Input.Group compact>
            {directionArr.map((item) => (
              <Input
                key={item.key}
                style={{ width: '25%' }}
                prefix={item.text}
                suffix="px"
                type="number"
                defaultValue={Util.FlitterNumber(useStyle['padding' + item.key])}
                onChange={(e) => {
                  updateStyle.direction('padding' + item.key, e.target.value);
                }}
              />
            ))}
          </Input.Group>
          <label className={styles['label-title']}>边框</label>
          <label>综合:</label>
          <Input.Group compact>
            <Input
              prefix="宽度"
              style={{ width: '35%' }}
              suffix="px"
              type="number"
              defaultValue={Util.FlitterNumber(useStyle.borderWidth)}
              onChange={(e) => {
                updateStyle.direction('borderWidth', e.target.value);
              }}
            />
            <Select
              style={{ width: '30%' }}
              className="select-after"
              defaultValue={useStyle.borderStyle}
              onChange={(e) => {
                updateStyle.direction('borderStyle', e, true);
              }}
            >
              <Option value="solid">实线</Option>
              <Option value="dashed">虚线</Option>
              <Option value="dotted">点线</Option>
              <Option value="double">双实线</Option>
            </Select>
            <Input
              prefix="颜色"
              style={{ width: '35%' }}
              defaultValue={useStyle.borderColor}
              type="color"
              onBlur={(e) => {
                updateStyle.direction('borderColor', e.target.value, true);
              }}
            />
          </Input.Group>
          <label>宽度：</label>
          <Input.Group compact>
            {directionArr.map((item) => (
              <Input
                key={item.key}
                style={{ width: '25%' }}
                prefix={item.text}
                suffix="px"
                type="number"
                defaultValue={Util.FlitterNumber(useStyle['border' + item.key + 'Width'])}
                onChange={(e) => {
                  updateStyle.direction('border' + item.key + 'Width', e.target.value);
                }}
              />
            ))}
          </Input.Group>
          <label>颜色：</label>
          <Input.Group compact>
            {directionArr.map((item) => (
              <Input
                key={item.key}
                style={{ width: '25%' }}
                prefix={item.text}
                suffix="px"
                type="color"
                defaultValue={useStyle['border' + item.key + 'Color']}
                onBlur={(e) => {
                  updateStyle.direction('border' + item.key + 'Color', e.target.value, true);
                }}
              />
            ))}
          </Input.Group>
          <label className={styles['label-title']}>圆角</label>
          <label>综合：</label>
          <Input
            style={{ width: '20%' }}
            suffix="px"
            type="number"
            defaultValue={Util.FlitterNumber(useStyle.borderRadius)}
            onChange={(e) => {
              updateStyle.direction('borderRadius', e.target.value);
            }}
          />
          <label>四角：</label>
          <Input.Group compact>
            {angleArr.map((item) => (
              <Input
                key={item.key}
                style={{ width: '45%', margin: '5px' }}
                prefix={item.text}
                suffix="px"
                type="number"
                defaultValue={useStyle['border' + item.key + 'Radius']}
                onChange={(e) => {
                  updateStyle.direction('border' + item.key + 'Radius', e.target.value);
                }}
              />
            ))}
          </Input.Group>
        </Space>
      )}
    </div>
  );
};
export default StylePanel;
