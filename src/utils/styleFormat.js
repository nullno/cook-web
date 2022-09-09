// 删除字符串头尾空白
export function delStartAndEndSpace(st) {
  if (typeof st !== 'string') {
    return st;
  }
  let cpst = st;
  cpst = cpst.replace(/^\s*/, '');
  cpst = cpst.replace(/\s*$/, '');
  return cpst;
}
// 删除字符串头尾空白分号
export function delStartAndEndsplit(st) {
  if (typeof st !== 'string') {
    return st;
  }
  let cpst = st;
  cpst = cpst.replace(/^(\s*:*\s*)*/, '');
  cpst = cpst.replace(/(\s*:*\s*)*$/, '');
  return cpst;
}
// 对象样式名转成代码样式名
export function styleNameObjectToCode(name) {
  let splitName = name.split(/(?=[A-Z])/);
  let lowerSplitName = [];
  splitName.map((item) => {
    lowerSplitName.push(item.toLowerCase());
  });
  return lowerSplitName.join('-');
}
// 代码样式名转成对象样式名
export function styleNameCodeToObject(name) {
  let splitName = name.split('-');
  let lowerSplitName = [];
  splitName.map((item, index) => {
    let newname = item;
    if (index >= 1 && item.length > 1) {
      // 首字母大写
      let firstName = item.slice(0, 1);
      let otherName = item.slice(1);
      firstName = firstName.toUpperCase();
      otherName = otherName.toLowerCase();
      newname = `${firstName}${otherName}`;
    }
    lowerSplitName.push(newname);
  });
  return lowerSplitName.join('');
}
// 将样式对象转成样式代码字符串
export function styleObjectToCodeString(objStyle) {
  let styleCodeString = '';
  for (const key in objStyle) {
    // 取出每个样式，过滤空格和分号，然后合并成字符串
    if (Object.prototype.hasOwnProperty.call(objStyle, key)) {
      let element = delStartAndEndSpace(objStyle[key]);
      element = delStartAndEndsplit(element);
      let keystring = delStartAndEndSpace(key);
      keystring = delStartAndEndsplit(keystring);
      if (element !== undefined) {
        styleCodeString += `${styleNameObjectToCode(keystring)}: ${element};\n`;
      }
    }
  }
  // 包裹元素是为了在编辑器里面可以有智能提示
  return `el{\n${styleCodeString}}`;
}
// 将代码字符串转成样式对象
export function styleCodeStringToObject(CodeString) {
  let styleString = CodeString;
  // 去除包裹的原元素 前后空白符
  styleString = delStartAndEndSpace(styleString);
  styleString = styleString.replace(/^el\{/, '');
  styleString = styleString.replace(/\}$/, '');
  // 通过封号分割成单个样式
  const styleArr = styleString.split(';');

  let styleObject = {};
  styleArr.map((item) => {
    // 异常数据直接返回
    if (item === '' || !/:/.test(item)) {
      return;
    }
    // 去掉头尾空白符
    let itemStyle = delStartAndEndSpace(item);
    // 分成样式和值
    let name = itemStyle.match(/^.*\:/);
    let value = itemStyle.match(/:.*$/);
    if (!Array.isArray(name) || !Array.isArray(value)) {
      return;
    }
    name = delStartAndEndSpace(name[0]);
    name = delStartAndEndsplit(name);
    value = delStartAndEndSpace(value[0]);
    value = delStartAndEndsplit(value);
    styleObject[styleNameCodeToObject(name)] = value;
  });
  return styleObject;
}

// 对比样式对象 没有的置 undefined
export function styleObjectUndefined(oldStyleObject, newStyleObject) {
  let newObject = {};
  for (const oldKey in oldStyleObject) {
    if (Object.hasOwnProperty.call(oldStyleObject, oldKey)) {
      newObject[oldKey] = newStyleObject[oldKey];
    }
  }
  return { ...newObject, ...newStyleObject };
}
