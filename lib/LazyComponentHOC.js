'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('intersection-observer');

var io = void 0;
var loaders = new Map();
io = new window.IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    var loader = loaders.get(entry.target);

    if (loader && entry.intersectionRatio > 0) {
      loader.showLoader();
    }
  });
});

function LazyComponentHOC(load) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  return function (_Component) {
    _inherits(LazyComponentHOCComponent, _Component);

    function LazyComponentHOCComponent(props) {
      _classCallCheck(this, LazyComponentHOCComponent);

      var _this = _possibleConstructorReturn(this, _Component.call(this, props));

      Object.defineProperty(_this, 'initRef', {
        enumerable: true,
        writable: true,
        value: function value(element) {
          _this.removeTrackedLoader();
          _this.defaultLoading = element;

          if (element) {
            loaders.set(element, _this);
            io.observe(element);
          }
        }
      });
      Object.defineProperty(_this, 'showLoader', {
        enumerable: true,
        writable: true,
        value: function value() {
          _this.removeTrackedLoader();
          _this.setState({
            visible: true
          });
        }
      });
      Object.defineProperty(_this, 'removeTrackedLoader', {
        enumerable: true,
        writable: true,
        value: function value() {
          _this.defaultLoading && io.unobserve(_this.defaultLoading);
          loaders.get(_this.defaultLoading) && loaders.delete(_this.defaultLoading);
        }
      });

      _this.state = {
        Component: load,
        defaultHeight: opts.height || 500
      };
      return _this;
    }

    LazyComponentHOCComponent.prototype.componentWillUnmount = function componentWillUnmount() {
      this.removeTrackedLoader();
    };

    LazyComponentHOCComponent.prototype.render = function render() {
      var _state = this.state,
          Component = _state.Component,
          defaultHeight = _state.defaultHeight,
          visible = _state.visible;

      if (visible) {
        return Component ? Component.default ? _react2.default.createElement(Component.default, this.props) : _react2.default.createElement(Component, this.props) : null;
      }

      return _react2.default.createElement('div', { style: { height: defaultHeight + "px" }, ref: this.initRef });
    };

    return LazyComponentHOCComponent;
  }(_react.Component);
}

module.exports = LazyComponentHOC;