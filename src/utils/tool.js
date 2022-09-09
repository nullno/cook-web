/**
 * 对象深拷贝
 * @param {*} obj 目标对象
 * @returns
 */
export const deepCopyObj = function (obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        result[key] = deepCopyObj(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
};
/**
 * 获取屏幕尺寸
*/
export const screen = {
  width: function() {
    return (
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    );
  },
  height: function() {
    return (
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    );
  },
  scrollTop: function() {
    return document.documentElement.scrollTop || document.body.scrollTop;
  },
  scrollHeight: function() {
    return document.documentElement.scrollHeight || document.body.scrollHeight;
  },
  resize: function(callback) {
    window.onresize = function() {
      callback({
        width:  screen.width(),
        height: screen.height(),
      });
    };
    window.onresize();
  },
};
