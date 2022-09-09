const dragBox = function(el, option = {}) {
  this.option = Object.assign(
    {
      disableX: false, // 约束x轴移动
      disableY: false, // 约束y轴移动
      disable: false, // 禁用移动
    },
    option
  );

  this.$el = el;

  this.addEvent();
};

// 更新设置
dragBox.prototype.updateSet = function(option) {
  this.option = Object.assign(this.option, option);
};

// 获取坐标点
dragBox.prototype.getPointXY = function(e) {
  // 触屏模式 || 鼠标模式
  const dragWay = e.targetTouches ? e.targetTouches[0] : e;
  var x1 = dragWay.clientX || dragWay.pageX;
  var y1 = dragWay.clientY || dragWay.pageY;
  var x2 = this.$el.offsetLeft;
  var y2 = this.$el.offsetTop;

  return {
    x: x1 - x2,
    y: y1 - y2,
  };
};

dragBox.prototype.addEvent = function() {
  const _scope = this;
  if (!this.$el.children[0]) return;
  const dragHandler = this.$el.children[0];
  dragHandler.style.cursor = "move";
  const isTouch = "ontouchstart" in window ? true : false;
  let dragFlag = false;
  let startX = 0,
    startY = 0;
  let setPosition = function(x, y) {
    if (_scope.option.disable) {
      return;
    }
    _scope.$el.style.marginLeft = "unset";
    _scope.$el.style.marginTop = "unset";

    if (!_scope.option.disableX) {
      _scope.$el.style.left = x + "px";
    }
    if (!_scope.option.disableY) {
      _scope.$el.style.top = y + "px";
    }
    _scope.option.onchange &&
      _scope.option.onchange.call(_scope, { x: x, y: y });
  };

  dragHandler.addEventListener(
    isTouch ? "touchstart" : "mousedown",
    function(e) {
      dragFlag = true;
      const pointStart = _scope.getPointXY(e || window.event);
      startX = pointStart.x;
      startY = pointStart.y;
      document.body.style.touchAction = "none";
    },
    false
  );
  document.body.addEventListener(
    isTouch ? "touchmove" : "mousemove",
    function(e) {
      if (!dragFlag) return;
      e.preventDefault();
      e.stopPropagation();

      const dragWay = e.targetTouches ? e.targetTouches[0] : e;
      var pageX = dragWay.clientX || dragWay.pageX;
      var pageY = dragWay.clientY || dragWay.pageY;
      setPosition(pageX - startX, pageY - startY);
    },
    false
  );
  document.body.addEventListener(
    isTouch ? "touchend" : "mouseup",
    function(e) {
      dragFlag = false;
      document.body.style.touchAction = "unset";
    },
    false
  );
};

export default dragBox;
