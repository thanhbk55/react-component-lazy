"use strict";
exports.__esModule = !0;
var _react = require("react"),
  _react2 = _interopRequireDefault(_react);
function _interopRequireDefault(a) {
  return a && a.__esModule ? a : { default: a };
}
function _classCallCheck(a, b) {
  if (!(a instanceof b))
    throw new TypeError("Cannot call a class as a function");
}
function _possibleConstructorReturn(a, b) {
  if (!a)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return b && ("object" == typeof b || "function" == typeof b) ? b : a;
}
function _inherits(a, b) {
  if ("function" != typeof b && null !== b)
    throw new TypeError(
      "Super expression must either be null or a function, not " + typeof b
    );
  (a.prototype = Object.create(b && b.prototype, {
    constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 }
  })),
    b &&
      (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : (a.__proto__ = b));
}
var io,
  loaders = new Map();
io = new window.IntersectionObserver(function(a) {
  a.forEach(function(b) {
    var c = loaders.get(b.target);
    c && 0 < b.intersectionRatio && c.showLoader();
  });
});
var LazyComponent = (function(a) {
  function b(c) {
    _classCallCheck(this, b);
    var d = _possibleConstructorReturn(this, a.call(this, c));
    return (
      (d.initRef = function(e) {
        d.removeTrackedLoader(),
          (d.defaultLoading = e),
          e && (loaders.set(e, d), io.observe(e));
      }),
      (d.showLoader = function() {
        d.removeTrackedLoader(), d.setState({ visible: !0 });
      }),
      (d.removeTrackedLoader = function() {
        d.defaultLoading && io.unobserve(d.defaultLoading),
          loaders.get(d.defaultLoading) && loaders.delete(d.defaultLoading);
      }),
      (d.state = {
        visible: d.props.visible || !1,
        defaultHeight: d.props.height || 500
      }),
      d
    );
  }
  return (
    _inherits(b, a),
    (b.prototype.componentWillUnmount = function componentWillUnmount() {
      this.removeTrackedLoader();
    }),
    (b.prototype.render = function render() {
      var _state = this.state,
        c = _state.visible,
        d = _state.defaultHeight;
      return c
        ? this.props.children
        : _react2.default.createElement("div", {
            style: { height: d + "px" },
            ref: this.initRef
          });
    }),
    b
  );
})(_react.Component);
exports.default = LazyComponent;
