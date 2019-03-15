'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var ErrorComponent = function (_Component) {
  _inherits(ErrorComponent, _Component);

  function ErrorComponent() {
    _classCallCheck(this, ErrorComponent);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  ErrorComponent.prototype.render = function render() {
    return null;
  };

  return ErrorComponent;
}(_react.Component);

function LazyImport(load) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var result = {
    Component: null
  };

  return function (_Component2) {
    _inherits(LazyImportComponent, _Component2);

    function LazyImportComponent(props) {
      _classCallCheck(this, LazyImportComponent);

      var _this2 = _possibleConstructorReturn(this, _Component2.call(this, props));

      _this2.state = {
        Component: result.Component,
        err: false,
        retries: opts.retries || 30
      };
      return _this2;
    }

    // componentDidUpdate(){
    //   if(!this.state.Component && this.state.err){
    //     this.loadComponent()
    //   }
    // }

    LazyImportComponent.prototype.componentWillMount = function componentWillMount() {
      this.loadComponent();
    };

    LazyImportComponent.prototype.loadComponent = function loadComponent() {
      var _this3 = this;

      retry(function (resolve, reject) {
        load().then(function (Component) {
          resolve(Component);
        }).catch(function (err) {
          setTimeout(function () {
            reject(err);
          }, 1000);
        });
      }, this.state.retries).then(function (Component) {
        result.Component = Component;
        _this3.setState({ Component: Component, err: false });
      }).catch(function (err) {
        !_this3.state.err && _this3.setState({ err: true });
        throw err;
      });
    };

    LazyImportComponent.prototype.render = function render() {
      var _state = this.state,
          Component = _state.Component,
          err = _state.err;

      if (err) {
        return _react2.default.createElement(ErrorComponent, null);
      }
      return Component ? Component.default ? _react2.default.createElement(Component.default, this.props) : _react2.default.createElement(Component, this.props) : _react2.default.createElement(ErrorComponent, null);
    };

    return LazyImportComponent;
  }(_react.Component);
}

module.exports = LazyImport;