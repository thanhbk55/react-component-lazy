'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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

var LazyComponent = function (_Component) {
  _inherits(LazyComponent, _Component);

  function LazyComponent(props) {
    _classCallCheck(this, LazyComponent);

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
      visible: _this.props.visible || false,
      defaultHeight: _this.props.height || 500
    };
    return _this;
  }

  LazyComponent.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeTrackedLoader();
  };

  LazyComponent.prototype.render = function render() {
    var _state = this.state,
        visible = _state.visible,
        defaultHeight = _state.defaultHeight;

    if (visible) {
      return this.props.children;
    }

    return _react2.default.createElement('div', { style: { height: defaultHeight + "px" }, ref: this.initRef });
  };

  return LazyComponent;
}(_react.Component);

Object.defineProperty(LazyComponent, 'propTypes', {
  enumerable: true,
  writable: true,
  value: {
    visible: _propTypes2.default.bool,
    height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
  }
});
exports.default = LazyComponent;