'use strict';

exports.__esModule = true;
exports.LazyComponent = exports.default = exports.LazyVisible = exports.LazyImport = undefined;

var _LazyImport = require('./LazyImport');

Object.defineProperty(exports, 'LazyImport', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_LazyImport).default;
  }
});

var _LazyVisible = require('./LazyVisible');

Object.defineProperty(exports, 'LazyVisible', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_LazyVisible).default;
  }
});

var _LazyComponentHOC = require('./LazyComponentHOC');

Object.defineProperty(exports, 'LazyComponent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_LazyComponentHOC).default;
  }
});

var _LazyComponent = require('./LazyComponent');

var _LazyComponent2 = _interopRequireDefault(_LazyComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _LazyComponent2.default;