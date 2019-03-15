'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function retry(retryFn) {
  var retries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  console.log(retries + ' retries left!');
  var promise = new Promise(retryFn);
  if (retries > 0) {
    return promise.catch(function () {
      return retry(retryFn, --retries);
    });
  }

  return promise;
}

function checkError(opts) {
  var check = false;
  var opt_check_arr = [{ field: "height", type: "number" }, { field: "loadding", type: "function" }, { field: "delay", type: "number" }];
  opt_check_arr.forEach(function (item) {
    if (opts[item.field] && _typeof(opts[item.field]) !== item.type) {
      console.log('\nparam \'' + item.field + '\' invalid\n');
      check = true;
    }
  });
  return check;
}

var ErrorComponent = function (_Component) {
  _inherits(ErrorComponent, _Component);

  function ErrorComponent() {
    _classCallCheck(this, ErrorComponent);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  ErrorComponent.prototype.render = function render() {
    var _props = this.props,
        err = _props.err,
        show_error = _props.show_error,
        retryFn = _props.retryFn;

    if (!show_error) return null;
    return _react2.default.createElement(
      'div',
      null,
      show_error(retryFn, err)
    );
  };

  return ErrorComponent;
}(_react.Component);

function LazyVisible(load) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (checkError(opts)) {
    return ErrorComponent;
  }
  var result = {
    Component: null
  };

  return function (_Component2) {
    _inherits(LazyVisibleComponent, _Component2);

    function LazyVisibleComponent(props) {
      _classCallCheck(this, LazyVisibleComponent);

      var _this2 = _possibleConstructorReturn(this, _Component2.call(this, props));

      Object.defineProperty(_this2, 'initRef', {
        enumerable: true,
        writable: true,
        value: function value(element) {
          _this2.removeTrackedLoader();
          _this2.defaultLoading = element;

          if (element) {
            loaders.set(element, _this2);
            io.observe(element);
          }
        }
      });
      Object.defineProperty(_this2, 'showLoader', {
        enumerable: true,
        writable: true,
        value: function value() {
          _this2.removeTrackedLoader();
          _this2.createTimeout();
          if (!_this2.state.Component) {
            retry(function (resolve, reject) {
              load().then(function (Component) {
                resolve(Component);
              }).catch(function (err) {
                reject(err);
              });
            }, _this2.state.retries).then(function (Component) {
              result.Component = Component;
              _this2.setState({ Component: Component, err: false });
            }).catch(function (err) {
              !_this2.state.err && _this2.setState({ err: true });
              _this2.clearTimeOut();
              throw err;
            });
          }
        }
      });
      Object.defineProperty(_this2, 'removeTrackedLoader', {
        enumerable: true,
        writable: true,
        value: function value() {
          _this2.defaultLoading && io.unobserve(_this2.defaultLoading);
          loaders.get(_this2.defaultLoading) && loaders.delete(_this2.defaultLoading);
        }
      });

      _this2.state = {
        Component: result.Component,
        err: null,
        defaultHeight: opts.height || 500,
        loading: opts.loading,
        passDelay: opts.delay ? false : true,
        delay: opts.delay,
        retries: opts.retries || 3
      };
      return _this2;
    }

    LazyVisibleComponent.prototype.componentWillUnmount = function componentWillUnmount() {
      this.removeTrackedLoader();
      this.clearTimeOut();
    };

    LazyVisibleComponent.prototype.createTimeout = function createTimeout() {
      var _this3 = this;

      var _state = this.state,
          delay = _state.delay,
          passDelay = _state.passDelay;

      if (delay && !passDelay) {
        this.delay = setTimeout(function () {
          _this3.setState({ passDelay: true });
        }, delay);
      }
    };

    LazyVisibleComponent.prototype.clearTimeOut = function clearTimeOut() {
      clearTimeout(this.delay);
    };

    LazyVisibleComponent.prototype.render = function render() {
      var _state2 = this.state,
          Component = _state2.Component,
          defaultHeight = _state2.defaultHeight,
          err = _state2.err,
          loading = _state2.loading,
          passDelay = _state2.passDelay;


      if (err) {
        return _react2.default.createElement(ErrorComponent, { err: err, show_error: opts.error, retryFn: this.showLoader });
      }

      if (Component && passDelay) {
        return Component ? Component.default ? _react2.default.createElement(Component.default, this.props) : _react2.default.createElement(Component, this.props) : _react2.default.createElement(ErrorComponent, null);
      }

      return _react2.default.createElement(
        'div',
        { style: { height: defaultHeight + "px" }, ref: this.initRef },
        loading && loading()
      );
    };

    return LazyVisibleComponent;
  }(_react.Component);
}

module.exports = LazyVisible;