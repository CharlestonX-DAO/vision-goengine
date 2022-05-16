(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _features = {};
var _getCallbacks = {};
var _setCallbacks = {};

var _FEATURE_UNSUPPORT = -1;

var _default = {
  FEATURE_UNSUPPORT: _FEATURE_UNSUPPORT,
  CANVAS_CONTEXT2D_TEXTBASELINE_ALPHABETIC: {
    name: "canvas.context2d.textbaseline.alphabetic",
    enable: 1,
    disable: 0
  },
  CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT: {
    name: "canvas.context2d.textbaseline.default",
    alphabetic: 1,
    bottom: 0
  },
  setFeature: function setFeature(featureName, property, value) {
    var feature = _features[featureName];

    if (!feature) {
      feature = _features[featureName] = {};
    }

    feature[property] = value;
  },
  getFeatureProperty: function getFeatureProperty(featureName, property) {
    var feature = _features[featureName];
    return feature ? feature[property] : undefined;
  },
  registerFeatureProperty: function registerFeatureProperty(key, getFunction, setFunction) {
    if (typeof key !== "string") {
      return false;
    }

    if (typeof getFunction !== "function" && typeof setFunction !== "function") {
      return false;
    }

    if (typeof getFunction === "function" && typeof _getCallbacks[key] === "function") {
      return false;
    }

    if (typeof setFunction === "function" && typeof _setCallbacks[key] === "function") {
      return false;
    }

    if (typeof getFunction === "function") {
      _getCallbacks[key] = getFunction;
    }

    if (typeof setFunction === "function") {
      _setCallbacks[key] = setFunction;
    }

    return true;
  },
  unregisterFeatureProperty: function unregisterFeatureProperty(key, getBool, setBool) {
    if (typeof key !== "string") {
      return false;
    }

    if (typeof getBool !== "boolean" || typeof setBool !== "boolean") {
      return false;
    }

    if (getBool === true && typeof _getCallbacks[key] === "function") {
      _getCallbacks[key] = undefined;
    }

    if (setBool === true && typeof _setCallbacks[key] === "function") {
      _setCallbacks[key] = undefined;
    }

    return true;
  },
  getFeaturePropertyInt: function getFeaturePropertyInt(key) {
    if (typeof key !== "string") {
      return _FEATURE_UNSUPPORT;
    }

    var getFunction = _getCallbacks[key];

    if (getFunction === undefined) {
      return _FEATURE_UNSUPPORT;
    }

    var value = getFunction();

    if (typeof value !== "number") {
      return _FEATURE_UNSUPPORT;
    }

    if (value < _FEATURE_UNSUPPORT) {
      value = _FEATURE_UNSUPPORT;
    }

    return value;
  },
  setFeaturePropertyInt: function setFeaturePropertyInt(key, value) {
    if (typeof key !== "string" && typeof value !== "number" && value < 0) {
      return false;
    }

    var setFunction = _setCallbacks[key];

    if (setFunction === undefined) {
      return false;
    }

    var returnCode = setFunction(value);

    if (typeof returnCode !== "number" && typeof returnCode !== 'boolean') {
      return false;
    }

    return returnCode ? true : false;
  }
};
exports["default"] = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _CANPLAY_CALLBACK = "canplayCallbacks";
var _ENDED_CALLBACK = "endedCallbacks";
var _ERROR_CALLBACK = "errorCallbacks";
var _PAUSE_CALLBACK = "pauseCallbacks";
var _PLAY_CALLBACK = "playCallbacks";
var _SEEKED_CALLBACK = "seekedCallbacks";
var _SEEKING_CALLBACK = "seekingCallbacks";
var _STOP_CALLBACK = "stopCallbacks";
var _TIME_UPDATE_CALLBACK = "timeUpdateCallbacks";
var _WAITING_CALLBACK = "waitingCallbacks";
var _ERROR_CODE = {
  ERROR_SYSTEM: 10001,
  ERROR_NET: 10002,
  ERROR_FILE: 10003,
  ERROR_FORMAT: 10004,
  ERROR_UNKNOWN: -1
};
var _STATE = {
  ERROR: -1,
  INITIALIZING: 0,
  PLAYING: 1,
  PAUSED: 2
};
var _audioEngine = undefined;

var _weakMap = new WeakMap();

var _offCallback = function _offCallback(target, type, callback) {
  var privateThis = _weakMap.get(target);

  if (typeof callback !== "function" || !privateThis) {
    return -1;
  }

  var callbacks = privateThis[type] || [];

  for (var i = 0, len = callbacks.length; i < len; ++i) {
    if (callback === callbacks[i]) {
      callbacks.splice(i, 1);
      return callback.length + 1;
    }
  }

  return 0;
};

var _onCallback = function _onCallback(target, type, callback) {
  var privateThis = _weakMap.get(target);

  if (typeof callback !== "function" || !privateThis) {
    return -1;
  }

  var callbacks = privateThis[type];

  if (!callbacks) {
    callbacks = privateThis[type] = [callback];
  } else {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      if (callback === callbacks[i]) {
        return 0;
      }
    }

    callbacks.push(callback);
  }

  return callbacks.length;
};

var _dispatchCallback = function _dispatchCallback(target, type) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var privateThis = _weakMap.get(target);

  if (privateThis) {
    var callbacks = privateThis[type] || [];

    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(target, args);
    }
  }
};

function InnerAudioContext() {
  this.startTime = 0;
  this.autoplay = false;

  _weakMap.set(this, {
    src: "",
    volume: 1,
    loop: false
  });

  Object.defineProperty(this, "loop", {
    set: function set(value) {
      value = !!value;

      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          _audioEngine.setLoop(audioID, value);
        }

        privateThis.loop = value;
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);

      return privateThis ? privateThis.loop : false;
    }
  });
  Object.defineProperty(this, "volume", {
    set: function set(value) {
      if (typeof value === "number") {
        if (value < 0) {
          value = 0;
        } else if (value > 1) {
          value = 1;
        }
      } else {
        value = 1;
      }

      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          _audioEngine.setVolume(audioID, value);
        }

        privateThis.volume = value;
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);

      return privateThis ? privateThis.volume : 1;
    }
  });
  Object.defineProperty(this, "src", {
    set: function set(value) {
      var privateThis = _weakMap.get(this);

      if (!privateThis) {
        return;
      }

      var oldSrc = privateThis.src;
      privateThis.src = value;

      if (typeof value === "string") {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0 && _audioEngine.getState(audioID) === _STATE.PAUSED && oldSrc !== value) {
          _audioEngine.stop(audioID);

          privateThis.audioID = -1;
        }

        var self = this;

        _audioEngine.preload(value, function () {
          setTimeout(function () {
            if (self.src === value) {
              _dispatchCallback(self, _CANPLAY_CALLBACK);

              if (self.autoplay) {
                self.play();
              }
            }
          });
        });
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);

      return privateThis ? privateThis.src : "";
    }
  });
  Object.defineProperty(this, "duration", {
    get: function get() {
      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getDuration(audioID);
        }
      }

      return NaN;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "currentTime", {
    get: function get() {
      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getCurrentTime(audioID);
        }
      }

      return 0;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "paused", {
    get: function get() {
      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getState(audioID) === _STATE.PAUSED;
        }
      }

      return true;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "buffered", {
    get: function get() {
      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getBuffered(audioID);
        }
      }

      return 0;
    },
    set: function set() {}
  });
}

var _prototype = InnerAudioContext.prototype;

_prototype.destroy = function () {
  var privateThis = _weakMap.get(this);

  if (privateThis) {
    var audioID = privateThis.audioID;

    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.stop(audioID);

      privateThis.audioID = -1;

      _dispatchCallback(this, _STOP_CALLBACK);
    }

    privateThis[_CANPLAY_CALLBACK] = [];
    privateThis[_ENDED_CALLBACK] = [];
    privateThis[_ERROR_CALLBACK] = [];
    privateThis[_PAUSE_CALLBACK] = [];
    privateThis[_PLAY_CALLBACK] = [];
    privateThis[_SEEKED_CALLBACK] = [];
    privateThis[_SEEKING_CALLBACK] = [];
    privateThis[_STOP_CALLBACK] = [];
    privateThis[_TIME_UPDATE_CALLBACK] = [];
    privateThis[_WAITING_CALLBACK] = [];
    clearInterval(privateThis.intervalID);
  }
};

_prototype.play = function () {
  var privateThis = _weakMap.get(this);

  if (!privateThis) {
    return;
  }

  var src = privateThis.src;
  var audioID = privateThis.audioID;

  if (typeof src !== "string" || src === "") {
    _dispatchCallback(this, _ERROR_CALLBACK, [{
      errMsg: "invalid src",
      errCode: _ERROR_CODE.ERROR_FILE
    }]);

    return;
  }

  if (typeof audioID === "number" && audioID >= 0) {
    if (_audioEngine.getState(audioID) === _STATE.PAUSED) {
      _audioEngine.resume(audioID);

      _dispatchCallback(this, _PLAY_CALLBACK);

      return;
    } else {
      _audioEngine.stop(audioID);

      privateThis.audioID = -1;
    }
  }

  audioID = _audioEngine.play(src, this.loop, this.volume);

  if (audioID === -1) {
    _dispatchCallback(this, _ERROR_CALLBACK, [{
      errMsg: "unknown",
      errCode: _ERROR_CODE.ERROR_UNKNOWN
    }]);

    return;
  }

  privateThis.audioID = audioID;

  if (typeof this.startTime === "number" && this.startTime > 0) {
    _audioEngine.setCurrentTime(audioID, this.startTime);
  }

  _dispatchCallback(this, _WAITING_CALLBACK);

  var self = this;

  _audioEngine.setCanPlayCallback(audioID, function () {
    if (src === self.src) {
      _dispatchCallback(self, _CANPLAY_CALLBACK);

      _dispatchCallback(self, _PLAY_CALLBACK);
    }
  });

  _audioEngine.setWaitingCallback(audioID, function () {
    if (src === self.src) {
      _dispatchCallback(self, _WAITING_CALLBACK);
    }
  });

  _audioEngine.setErrorCallback(audioID, function () {
    if (src === self.src) {
      privateThis.audioID = -1;

      _dispatchCallback(self, _ERROR_CALLBACK);
    }
  });

  _audioEngine.setFinishCallback(audioID, function () {
    if (src === self.src) {
      privateThis.audioID = -1;

      _dispatchCallback(self, _ENDED_CALLBACK);
    }
  });
};

_prototype.pause = function () {
  var privateThis = _weakMap.get(this);

  if (privateThis) {
    var audioID = privateThis.audioID;

    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.pause(audioID);

      _dispatchCallback(this, _PAUSE_CALLBACK);
    }
  }
};

_prototype.seek = function (position) {
  var privateThis = _weakMap.get(this);

  if (privateThis && typeof position === "number" && position >= 0) {
    var audioID = privateThis.audioID;

    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.setCurrentTime(audioID, position);

      _dispatchCallback(this, _SEEKING_CALLBACK);

      _dispatchCallback(this, _SEEKED_CALLBACK);
    }
  }
};

_prototype.stop = function () {
  var privateThis = _weakMap.get(this);

  if (privateThis) {
    var audioID = privateThis.audioID;

    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.stop(audioID);

      privateThis.audioID = -1;

      _dispatchCallback(this, _STOP_CALLBACK);
    }
  }
};

_prototype.offCanplay = function (callback) {
  _offCallback(this, _CANPLAY_CALLBACK, callback);
};

_prototype.offEnded = function (callback) {
  _offCallback(this, _ENDED_CALLBACK, callback);
};

_prototype.offError = function (callback) {
  _offCallback(this, _ERROR_CALLBACK, callback);
};

_prototype.offPause = function (callback) {
  _offCallback(this, _PAUSE_CALLBACK, callback);
};

_prototype.offPlay = function (callback) {
  _offCallback(this, _PLAY_CALLBACK, callback);
};

_prototype.offSeeked = function (callback) {
  _offCallback(this, _SEEKED_CALLBACK, callback);
};

_prototype.offSeeking = function (callback) {
  _offCallback(this, _SEEKING_CALLBACK, callback);
};

_prototype.offStop = function (callback) {
  _offCallback(this, _STOP_CALLBACK, callback);
};

_prototype.offTimeUpdate = function (callback) {
  var result = _offCallback(this, _TIME_UPDATE_CALLBACK, callback);

  if (result === 1) {
    clearInterval(_weakMap.get(this).intervalID);
  }
};

_prototype.offWaiting = function (callback) {
  _offCallback(this, _WAITING_CALLBACK, callback);
};

_prototype.onCanplay = function (callback) {
  _onCallback(this, _CANPLAY_CALLBACK, callback);
};

_prototype.onEnded = function (callback) {
  _onCallback(this, _ENDED_CALLBACK, callback);
};

_prototype.onError = function (callback) {
  _onCallback(this, _ERROR_CALLBACK, callback);
};

_prototype.onPause = function (callback) {
  _onCallback(this, _PAUSE_CALLBACK, callback);
};

_prototype.onPlay = function (callback) {
  _onCallback(this, _PLAY_CALLBACK, callback);
};

_prototype.onSeeked = function (callback) {
  _onCallback(this, _SEEKED_CALLBACK, callback);
};

_prototype.onSeeking = function (callback) {
  _onCallback(this, "seekingCallbacks", callback);
};

_prototype.onStop = function (callback) {
  _onCallback(this, _STOP_CALLBACK, callback);
};

_prototype.onTimeUpdate = function (callback) {
  var result = _onCallback(this, _TIME_UPDATE_CALLBACK, callback);

  if (result === 1) {
    var privateThis = _weakMap.get(this);

    var self = this;
    var intervalID = setInterval(function () {
      var privateThis = _weakMap.get(self);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0 && _audioEngine.getState(audioID) === _STATE.PLAYING) {
          _dispatchCallback(self, _TIME_UPDATE_CALLBACK);
        }
      } else {
        clearInterval(intervalID);
      }
    }, 500);
    privateThis.intervalID = intervalID;
  }
};

_prototype.onWaiting = function (callback) {
  _onCallback(this, _WAITING_CALLBACK, callback);
};

function _default(AudioEngine) {
  if (_audioEngine === undefined) {
    _audioEngine = Object.assign({}, AudioEngine);
    Object.keys(AudioEngine).forEach(function (name) {
      if (typeof AudioEngine[name] === "function") {
        AudioEngine[name] = function () {
          console.warn("AudioEngine." + name + " is deprecated");
          return _audioEngine[name].apply(AudioEngine, arguments);
        };
      }
    });
  }

  return new InnerAudioContext();
}

;

},{}],3:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("onShow", _rt, ral);

_util["default"].exportTo("onHide", _rt, ral);

_util["default"].exportTo("offShow", _rt, ral);

_util["default"].exportTo("offHide", _rt, ral);

},{"../../util":21}],4:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("loadSubpackage", _rt, ral);

},{"../../util":21}],5:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("env", _rt, ral);

_util["default"].exportTo("getSystemInfo", _rt, ral);

_util["default"].exportTo("getSystemInfoSync", _rt, ral);

},{"../../util":21}],6:[function(require,module,exports){
"use strict";

var _jsb = window.jsb;

if (!_jsb) {
  _jsb = {};
}

var _rt = loadRuntime();

var _touches = [];

var _getTouchIndex = function _getTouchIndex(touch) {
  var element;

  for (var index = 0; index < _touches.length; index++) {
    element = _touches[index];

    if (touch.identifier === element.identifier) {
      return index;
    }
  }

  return -1;
};

var _copyObject = function _copyObject(fromObj, toObject) {
  for (var key in fromObj) {
    if (fromObj.hasOwnProperty(key)) {
      toObject[key] = fromObj[key];
    }
  }
};

var _listenerMap = {
  "touchstart": [],
  "touchmove": [],
  "touchend": [],
  "touchcancel": []
};

function _addListener(key, value) {
  var listenerArr = _listenerMap[key];

  for (var index = 0, length = listenerArr.length; index < length; index++) {
    if (value === listenerArr[index]) {
      return;
    }
  }

  listenerArr.push(value);
}

function _removeListener(key, value) {
  var listenerArr = _listenerMap[key] || [];
  var length = listenerArr.length;

  for (var index = 0; index < length; ++index) {
    if (value === listenerArr[index]) {
      listenerArr.splice(index, 1);
      return;
    }
  }
}

var _hasDellWith = false;

var _systemInfo = _rt.getSystemInfoSync();

if (window.innerWidth && _systemInfo.windowWidth !== window.innerWidth) {
  _hasDellWith = true;
}

var _touchEventHandlerFactory = function _touchEventHandlerFactory(type) {
  return function (changedTouches) {
    if (typeof changedTouches === "function") {
      _addListener(type, changedTouches);

      return;
    }

    var touchEvent = new TouchEvent(type);
    var index;

    if (type === "touchstart") {
      changedTouches.forEach(function (touch) {
        index = _getTouchIndex(touch);

        if (index >= 0) {
          _copyObject(touch, _touches[index]);
        } else {
          var tmp = {};

          _copyObject(touch, tmp);

          _touches.push(tmp);
        }
      });
    } else if (type === "touchmove") {
      changedTouches.forEach(function (element) {
        index = _getTouchIndex(element);

        if (index >= 0) {
          _copyObject(element, _touches[index]);
        }
      });
    } else if (type === "touchend" || type === "touchcancel") {
      changedTouches.forEach(function (element) {
        index = _getTouchIndex(element);

        if (index >= 0) {
          _touches.splice(index, 1);
        }
      });
    }

    var touches = [].concat(_touches);
    var _changedTouches = [];
    changedTouches.forEach(function (touch) {
      var length = touches.length;

      for (var _index = 0; _index < length; ++_index) {
        var _touch = touches[_index];

        if (touch.identifier === _touch.identifier) {
          _changedTouches.push(_touch);

          return;
        }
      }

      _changedTouches.push(touch);
    });
    touchEvent.touches = touches;
    touchEvent.targetTouches = touches;
    touchEvent.changedTouches = _changedTouches;

    if (_hasDellWith) {
      touches.forEach(function (touch) {
        touch.clientX /= window.devicePixelRatio;
        touch.clientY /= window.devicePixelRatio;
        touch.pageX /= window.devicePixelRatio;
        touch.pageY /= window.devicePixelRatio;
      });

      if (type === "touchcancel" || type === "touchend") {
        _changedTouches.forEach(function (touch) {
          touch.clientX /= window.devicePixelRatio;
          touch.clientY /= window.devicePixelRatio;
          touch.pageX /= window.devicePixelRatio;
          touch.pageY /= window.devicePixelRatio;
        });
      }
    }

    var listenerArr = _listenerMap[type];
    var length = listenerArr.length;

    for (var _index2 = 0; _index2 < length; _index2++) {
      listenerArr[_index2](touchEvent);
    }
  };
};

if (_rt.onTouchStart) {
  ral.onTouchStart = _rt.onTouchStart;
  ral.offTouchStart = _rt.offTouchStart;
} else {
  _jsb.onTouchStart = _touchEventHandlerFactory('touchstart');

  _jsb.offTouchStart = function (callback) {
    _removeListener("touchstart", callback);
  };

  ral.onTouchStart = _jsb.onTouchStart.bind(_jsb);
  ral.offTouchStart = _jsb.offTouchStart.bind(_jsb);
}

if (_rt.onTouchMove) {
  ral.onTouchMove = _rt.onTouchMove;
  ral.offTouchMove = _rt.offTouchMove;
} else {
  _jsb.onTouchMove = _touchEventHandlerFactory('touchmove');

  _jsb.offTouchMove = function (callback) {
    _removeListener("touchmove", callback);
  };

  ral.onTouchMove = _jsb.onTouchMove.bind(_jsb);
  ral.offTouchMove = _jsb.offTouchMove.bind(_jsb);
}

if (_rt.onTouchCancel) {
  ral.onTouchCancel = _rt.onTouchCancel;
  ral.offTouchCancel = _rt.offTouchCancel;
} else {
  _jsb.onTouchCancel = _touchEventHandlerFactory('touchcancel');

  _jsb.offTouchCancel = function (callback) {
    _removeListener("touchcancel", callback);
  };

  ral.onTouchCancel = _jsb.onTouchCancel.bind(_jsb);
  ral.offTouchCancel = _jsb.offTouchCancel.bind(_jsb);
}

if (_rt.onTouchEnd) {
  ral.onTouchEnd = _rt.onTouchEnd;
  ral.offTouchEnd = _rt.offTouchEnd;
} else {
  _jsb.onTouchEnd = _touchEventHandlerFactory('touchend');

  _jsb.offTouchEnd = function (callback) {
    _removeListener("touchend", callback);
  };

  ral.onTouchEnd = _jsb.onTouchEnd.bind(_jsb);
  ral.offTouchEnd = _jsb.offTouchEnd.bind(_jsb);
}

},{}],7:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

var _listeners = [];
ral.device = ral.device || {};

if (_rt.offAccelerometerChange) {
  if (_rt._compatibleMode === 1) {
    var _systemInfo = _rt.getSystemInfoSync();

    var _isAndroid = _systemInfo.platform.toLowerCase() === "android";

    var _compatibleAccelerometerChange = function _compatibleAccelerometerChange(e) {
      if (_isAndroid) {
        e.x /= -10;
        e.y /= -10;
        e.z /= -10;
      } else {
        e.x /= 10;
        e.y /= 10;
        e.z /= 10;
      }

      _listeners.forEach(function (listener) {
        listener(e);
      });
    };

    var _onAccelerometerChange = _rt.onAccelerometerChange.bind(_rt);

    ral.onAccelerometerChange = function (listener) {
      if (typeof listener === "function") {
        var length = _listeners.length;

        for (var index = 0; index < length; ++index) {
          if (listener === _listeners[index]) {
            return;
          }
        }

        _listeners.push(listener);

        if (_listeners.length === 1) {
          _onAccelerometerChange(_compatibleAccelerometerChange);
        }
      }
    };

    var _offAccelerometerChange = _rt.offAccelerometerChange.bind(_rt);

    ral.offAccelerometerChange = function (listener) {
      var length = _listeners.length;

      for (var index = 0; index < length; ++index) {
        if (listener === _listeners[index]) {
          _listeners.splice(index, 1);

          if (_listeners.length === 0) {
            _offAccelerometerChange(_compatibleAccelerometerChange);
          }

          break;
        }
      }
    };
  } else {
    ral.onAccelerometerChange = _rt.onAccelerometerChange.bind(_rt);
    ral.offAccelerometerChange = _rt.offAccelerometerChange.bind(_rt);
  }

  ral.stopAccelerometer = _rt.stopAccelerometer.bind(_rt);

  var _startAccelerometer = _rt.startAccelerometer.bind(_rt);

  ral.startAccelerometer = function (obj) {
    return _startAccelerometer(Object.assign({
      type: "accelerationIncludingGravity"
    }, obj));
  };
} else {
  ral.onAccelerometerChange = function (listener) {
    if (typeof listener === "function") {
      var length = _listeners.length;

      for (var index = 0; index < length; ++index) {
        if (listener === _listeners[index]) {
          return;
        }
      }

      _listeners.push(listener);
    }
  };

  ral.offAccelerometerChange = function (listener) {
    var length = _listeners.length;

    for (var index = 0; index < length; ++index) {
      if (listener === _listeners[index]) {
        _listeners.splice(index, 1);

        return;
      }
    }
  };

  var _systemInfo2 = _rt.getSystemInfoSync();

  var _isAndroid2 = _systemInfo2.platform.toLowerCase() === "android";

  jsb.device.dispatchDeviceMotionEvent = function (event) {
    var acceleration = Object.assign({}, event._accelerationIncludingGravity);

    if (_isAndroid2) {
      acceleration.x /= -10;
      acceleration.y /= -10;
      acceleration.z /= -10;
    } else {
      acceleration.x /= 10;
      acceleration.y /= 10;
      acceleration.z /= 10;
    }

    _listeners.forEach(function (listener) {
      listener({
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z
      });
    });
  };

  ral.stopAccelerometer = function () {
    jsb.device.setMotionEnabled(false);
  };

  ral.startAccelerometer = function () {
    jsb.device.setMotionEnabled(true);
  };
}

},{"../../util":21}],8:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("getBatteryInfo", _rt, ral);

_util["default"].exportTo("getBatteryInfoSync", _rt, ral);

},{"../../util":21}],9:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("getFileSystemManager", _rt, ral);

},{"../../util":21}],10:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../util"));

var _feature = _interopRequireDefault(require("../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (window.jsb) {
  window.ral = Object.assign({}, window.jsb);
} else {
  window.ral = {};
}

require("./base/lifecycle");

require("./base/subpackage");

require("./base/system-info");

require("./base/touch-event");

require("./device/accelerometer");

require("./device/battery");

require("./file/file-system-manager");

require("./interface/keyboard");

require("./interface/window");

require("./media/audio");

require("./media/video");

require("./network/download");

require("./rendering/canvas");

require("./rendering/webgl");

require("./rendering/font");

require("./rendering/frame");

require("./rendering/image");

for (var key in _feature["default"]) {
  if (key === "setFeature" || key === "registerFeatureProperty" || key === "unregisterFeatureProperty") {
    continue;
  }

  if (_feature["default"].hasOwnProperty(key)) {
    _util["default"].exportTo(key, _feature["default"], ral);
  }
}

},{"../feature":1,"../util":21,"./base/lifecycle":3,"./base/subpackage":4,"./base/system-info":5,"./base/touch-event":6,"./device/accelerometer":7,"./device/battery":8,"./file/file-system-manager":9,"./interface/keyboard":11,"./interface/window":12,"./media/audio":13,"./media/video":14,"./network/download":15,"./rendering/canvas":16,"./rendering/font":17,"./rendering/frame":18,"./rendering/image":19,"./rendering/webgl":20}],11:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("onKeyboardInput", _rt, ral);

_util["default"].exportTo("onKeyboardConfirm", _rt, ral);

_util["default"].exportTo("onKeyboardComplete", _rt, ral);

_util["default"].exportTo("offKeyboardInput", _rt, ral);

_util["default"].exportTo("offKeyboardConfirm", _rt, ral);

_util["default"].exportTo("offKeyboardComplete", _rt, ral);

_util["default"].exportTo("hideKeyboard", _rt, ral);

_util["default"].exportTo("showKeyboard", _rt, ral);

_util["default"].exportTo("updateKeyboard", _rt, ral);

},{"../../util":21}],12:[function(require,module,exports){
"use strict";

var _rt = loadRuntime();

var _onWindowResize = _rt.onWindowResize;

ral.onWindowResize = function (callBack) {
  _onWindowResize(function (size) {
    callBack(size.width || size.windowWidth, size.height || size.windowHeight);
  });
};

window.resize = function () {
  console.warn('window.resize() is deprecated');
};

},{}],13:[function(require,module,exports){
"use strict";

var _innerContext = _interopRequireDefault(require("../../inner-context"));

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("AudioEngine", _rt, ral);

_util["default"].exportTo("createInnerAudioContext", _rt, ral, function () {
  if (_rt.AudioEngine) {
    ral.createInnerAudioContext = function () {
      return (0, _innerContext["default"])(_rt.AudioEngine);
    };
  }
});

},{"../../inner-context":2,"../../util":21}],14:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("createVideo", _rt, ral);

},{"../../util":21}],15:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("downloadFile", _rt, ral);

},{"../../util":21}],16:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

var _feature = _interopRequireDefault(require("../../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("createCanvas", _rt, ral, function () {
  var featureValue = "unsupported";

  if (document && typeof document.createElement === "function") {
    featureValue = "wrapper";

    ral.createCanvas = function () {
      return document.createElement("canvas");
    };
  }

  _feature["default"].setFeature("ral.createCanvas", "spec", featureValue);
});

var _rt_getFeature = _rt.getFeature;
var _rt_setFeature = _rt.setFeature;

_feature["default"].registerFeatureProperty(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_ALPHABETIC.name, function () {
  if (typeof _rt_getFeature === "function") {
    var value = _rt_getFeature(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_ALPHABETIC.name);

    switch (value) {
      case 1:
        return _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_ALPHABETIC.enable;

      default:
        break;
    }
  }

  return _feature["default"].FEATURE_UNSUPPORT;
}, undefined);

_feature["default"].registerFeatureProperty(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.name, function () {
  if (typeof _rt_getFeature === "function") {
    var value = _rt_getFeature(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.name);

    switch (value) {
      case 1:
        return _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.alphabetic;

      case 0:
        return _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.bottom;

      default:
        break;
    }
  }

  return _feature["default"].FEATURE_UNSUPPORT;
}, function (value) {
  if (typeof _rt_setFeature === "function") {
    switch (value) {
      case _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.alphabetic:
        value = 1;
        break;

      case _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.bottom:
        value = 0;
        break;

      default:
        return false;
    }

    return _rt_setFeature(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.name, value);
  }

  return false;
});

},{"../../feature":1,"../../util":21}],17:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("loadFont", _rt, ral);

},{"../../util":21}],18:[function(require,module,exports){
"use strict";

var _rt = loadRuntime();

if (window.jsb && jsb.setPreferredFramesPerSecond) {
  ral.setPreferredFramesPerSecond = jsb.setPreferredFramesPerSecond.bind(jsb);
} else if (_rt.setPreferredFramesPerSecond) {
  ral.setPreferredFramesPerSecond = _rt.setPreferredFramesPerSecond.bind(_rt);
} else {
  ral.setPreferredFramesPerSecond = function () {
    console.error("The setPreferredFramesPerSecond is not define!");
  };
}

},{}],19:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

var _feature = _interopRequireDefault(require("../../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("loadImageData", _rt, ral);

_util["default"].exportTo("createImage", _rt, ral, function () {
  var featureValue = "unsupported";

  if (document && typeof document.createElement === "function") {
    featureValue = "wrapper";

    ral.createImage = function () {
      return document.createElement("image");
    };
  }

  _feature["default"].setFeature("ral.createImage", "spec", featureValue);
});

},{"../../feature":1,"../../util":21}],20:[function(require,module,exports){
"use strict";

if (window.__gl) {
  var gl = window.__gl;
  var _glTexImage2D = gl.texImage2D;

  gl.texImage2D = function (target, level, internalformat, width, height, border, format, type, pixels) {
    var argc = arguments.length;

    if (argc === 6) {
      var image = border;
      type = height;
      format = width;

      if (image instanceof HTMLImageElement) {
        var error = console.error;

        console.error = function () {};

        _glTexImage2D.apply(void 0, arguments);

        console.error = error;
        gl.texImage2D_image(target, level, image._imageMeta);
      } else if (image instanceof HTMLCanvasElement) {
        var _error = console.error;

        console.error = function () {};

        _glTexImage2D.apply(void 0, arguments);

        console.error = _error;
        var context2D = image.getContext('2d');
        gl.texImage2D_canvas(target, level, internalformat, format, type, context2D);
      } else if (image instanceof ImageData) {
        _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image.data);
      } else {
        console.error("Invalid pixel argument passed to gl.texImage2D!");
      }
    } else if (argc === 9) {
      _glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
    } else {
      console.error("gl.texImage2D: invalid argument count!");
    }
  };

  var _glTexSubImage2D = gl.texSubImage2D;

  gl.texSubImage2D = function (target, level, xoffset, yoffset, width, height, format, type, pixels) {
    var argc = arguments.length;

    if (argc === 7) {
      var image = format;
      type = height;
      format = width;

      if (image instanceof HTMLImageElement) {
        var error = console.error;

        console.error = function () {};

        _glTexSubImage2D.apply(void 0, arguments);

        console.error = error;
        gl.texSubImage2D_image(target, level, xoffset, yoffset, image._imageMeta);
      } else if (image instanceof HTMLCanvasElement) {
        var _error2 = console.error;

        console.error = function () {};

        _glTexSubImage2D.apply(void 0, arguments);

        console.error = _error2;
        var context2D = image.getContext('2d');
        gl.texSubImage2D_canvas(target, level, xoffset, yoffset, format, type, context2D);
      } else if (image instanceof ImageData) {
        _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image.data);
      } else {
        console.error("Invalid pixel argument passed to gl.texImage2D!");
      }
    } else if (argc === 9) {
      _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
    } else {
      console.error(new Error("gl.texImage2D: invalid argument count!").stack);
    }
  };
}

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _default = {
  exportTo: function exportTo(name, from, to, errCallback, successCallback) {
    if (_typeof(from) !== "object" || _typeof(to) !== "object") {
      console.warn("invalid exportTo: ", name);
      return;
    }

    var fromProperty = from[name];

    if (typeof fromProperty !== "undefined") {
      if (typeof fromProperty === "function") {
        to[name] = fromProperty.bind(from);
        Object.assign(to[name], fromProperty);
      } else {
        to[name] = fromProperty;
      }

      if (typeof successCallback === "function") {
        successCallback();
      }
    } else {
      to[name] = function () {
        console.error(name + " is not support!");
        return {};
      };

      if (typeof errCallback === "function") {
        errCallback();
      }
    }
  }
};
exports["default"] = _default;

},{}]},{},[10]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xudmFyIF9mZWF0dXJlcyA9IHt9O1xudmFyIF9nZXRDYWxsYmFja3MgPSB7fTtcbnZhciBfc2V0Q2FsbGJhY2tzID0ge307XG5cbnZhciBfRkVBVFVSRV9VTlNVUFBPUlQgPSAtMTtcblxudmFyIF9kZWZhdWx0ID0ge1xuICBGRUFUVVJFX1VOU1VQUE9SVDogX0ZFQVRVUkVfVU5TVVBQT1JULFxuICBDQU5WQVNfQ09OVEVYVDJEX1RFWFRCQVNFTElORV9BTFBIQUJFVElDOiB7XG4gICAgbmFtZTogXCJjYW52YXMuY29udGV4dDJkLnRleHRiYXNlbGluZS5hbHBoYWJldGljXCIsXG4gICAgZW5hYmxlOiAxLFxuICAgIGRpc2FibGU6IDBcbiAgfSxcbiAgQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfREVGQVVMVDoge1xuICAgIG5hbWU6IFwiY2FudmFzLmNvbnRleHQyZC50ZXh0YmFzZWxpbmUuZGVmYXVsdFwiLFxuICAgIGFscGhhYmV0aWM6IDEsXG4gICAgYm90dG9tOiAwXG4gIH0sXG4gIHNldEZlYXR1cmU6IGZ1bmN0aW9uIHNldEZlYXR1cmUoZmVhdHVyZU5hbWUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIHZhciBmZWF0dXJlID0gX2ZlYXR1cmVzW2ZlYXR1cmVOYW1lXTtcblxuICAgIGlmICghZmVhdHVyZSkge1xuICAgICAgZmVhdHVyZSA9IF9mZWF0dXJlc1tmZWF0dXJlTmFtZV0gPSB7fTtcbiAgICB9XG5cbiAgICBmZWF0dXJlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9LFxuICBnZXRGZWF0dXJlUHJvcGVydHk6IGZ1bmN0aW9uIGdldEZlYXR1cmVQcm9wZXJ0eShmZWF0dXJlTmFtZSwgcHJvcGVydHkpIHtcbiAgICB2YXIgZmVhdHVyZSA9IF9mZWF0dXJlc1tmZWF0dXJlTmFtZV07XG4gICAgcmV0dXJuIGZlYXR1cmUgPyBmZWF0dXJlW3Byb3BlcnR5XSA6IHVuZGVmaW5lZDtcbiAgfSxcbiAgcmVnaXN0ZXJGZWF0dXJlUHJvcGVydHk6IGZ1bmN0aW9uIHJlZ2lzdGVyRmVhdHVyZVByb3BlcnR5KGtleSwgZ2V0RnVuY3Rpb24sIHNldEZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGdldEZ1bmN0aW9uICE9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNldEZ1bmN0aW9uICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGdldEZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIF9nZXRDYWxsYmFja3Nba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzZXRGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBfc2V0Q2FsbGJhY2tzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZ2V0RnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgX2dldENhbGxiYWNrc1trZXldID0gZ2V0RnVuY3Rpb247XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzZXRGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBfc2V0Q2FsbGJhY2tzW2tleV0gPSBzZXRGdW5jdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgdW5yZWdpc3RlckZlYXR1cmVQcm9wZXJ0eTogZnVuY3Rpb24gdW5yZWdpc3RlckZlYXR1cmVQcm9wZXJ0eShrZXksIGdldEJvb2wsIHNldEJvb2wpIHtcbiAgICBpZiAodHlwZW9mIGtleSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZ2V0Qm9vbCAhPT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIHNldEJvb2wgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGdldEJvb2wgPT09IHRydWUgJiYgdHlwZW9mIF9nZXRDYWxsYmFja3Nba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBfZ2V0Q2FsbGJhY2tzW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHNldEJvb2wgPT09IHRydWUgJiYgdHlwZW9mIF9zZXRDYWxsYmFja3Nba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBfc2V0Q2FsbGJhY2tzW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGdldEZlYXR1cmVQcm9wZXJ0eUludDogZnVuY3Rpb24gZ2V0RmVhdHVyZVByb3BlcnR5SW50KGtleSkge1xuICAgIGlmICh0eXBlb2Yga2V5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gX0ZFQVRVUkVfVU5TVVBQT1JUO1xuICAgIH1cblxuICAgIHZhciBnZXRGdW5jdGlvbiA9IF9nZXRDYWxsYmFja3Nba2V5XTtcblxuICAgIGlmIChnZXRGdW5jdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gX0ZFQVRVUkVfVU5TVVBQT1JUO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IGdldEZ1bmN0aW9uKCk7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiKSB7XG4gICAgICByZXR1cm4gX0ZFQVRVUkVfVU5TVVBQT1JUO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA8IF9GRUFUVVJFX1VOU1VQUE9SVCkge1xuICAgICAgdmFsdWUgPSBfRkVBVFVSRV9VTlNVUFBPUlQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICBzZXRGZWF0dXJlUHJvcGVydHlJbnQ6IGZ1bmN0aW9uIHNldEZlYXR1cmVQcm9wZXJ0eUludChrZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiICYmIHZhbHVlIDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBzZXRGdW5jdGlvbiA9IF9zZXRDYWxsYmFja3Nba2V5XTtcblxuICAgIGlmIChzZXRGdW5jdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHJldHVybkNvZGUgPSBzZXRGdW5jdGlvbih2YWx1ZSk7XG5cbiAgICBpZiAodHlwZW9mIHJldHVybkNvZGUgIT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHJldHVybkNvZGUgIT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5Db2RlID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7fV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG52YXIgX0NBTlBMQVlfQ0FMTEJBQ0sgPSBcImNhbnBsYXlDYWxsYmFja3NcIjtcbnZhciBfRU5ERURfQ0FMTEJBQ0sgPSBcImVuZGVkQ2FsbGJhY2tzXCI7XG52YXIgX0VSUk9SX0NBTExCQUNLID0gXCJlcnJvckNhbGxiYWNrc1wiO1xudmFyIF9QQVVTRV9DQUxMQkFDSyA9IFwicGF1c2VDYWxsYmFja3NcIjtcbnZhciBfUExBWV9DQUxMQkFDSyA9IFwicGxheUNhbGxiYWNrc1wiO1xudmFyIF9TRUVLRURfQ0FMTEJBQ0sgPSBcInNlZWtlZENhbGxiYWNrc1wiO1xudmFyIF9TRUVLSU5HX0NBTExCQUNLID0gXCJzZWVraW5nQ2FsbGJhY2tzXCI7XG52YXIgX1NUT1BfQ0FMTEJBQ0sgPSBcInN0b3BDYWxsYmFja3NcIjtcbnZhciBfVElNRV9VUERBVEVfQ0FMTEJBQ0sgPSBcInRpbWVVcGRhdGVDYWxsYmFja3NcIjtcbnZhciBfV0FJVElOR19DQUxMQkFDSyA9IFwid2FpdGluZ0NhbGxiYWNrc1wiO1xudmFyIF9FUlJPUl9DT0RFID0ge1xuICBFUlJPUl9TWVNURU06IDEwMDAxLFxuICBFUlJPUl9ORVQ6IDEwMDAyLFxuICBFUlJPUl9GSUxFOiAxMDAwMyxcbiAgRVJST1JfRk9STUFUOiAxMDAwNCxcbiAgRVJST1JfVU5LTk9XTjogLTFcbn07XG52YXIgX1NUQVRFID0ge1xuICBFUlJPUjogLTEsXG4gIElOSVRJQUxJWklORzogMCxcbiAgUExBWUlORzogMSxcbiAgUEFVU0VEOiAyXG59O1xudmFyIF9hdWRpb0VuZ2luZSA9IHVuZGVmaW5lZDtcblxudmFyIF93ZWFrTWFwID0gbmV3IFdlYWtNYXAoKTtcblxudmFyIF9vZmZDYWxsYmFjayA9IGZ1bmN0aW9uIF9vZmZDYWxsYmFjayh0YXJnZXQsIHR5cGUsIGNhbGxiYWNrKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0YXJnZXQpO1xuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIiB8fCAhcHJpdmF0ZVRoaXMpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICB2YXIgY2FsbGJhY2tzID0gcHJpdmF0ZVRoaXNbdHlwZV0gfHwgW107XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChjYWxsYmFjayA9PT0gY2FsbGJhY2tzW2ldKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmxlbmd0aCArIDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIDA7XG59O1xuXG52YXIgX29uQ2FsbGJhY2sgPSBmdW5jdGlvbiBfb25DYWxsYmFjayh0YXJnZXQsIHR5cGUsIGNhbGxiYWNrKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0YXJnZXQpO1xuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIiB8fCAhcHJpdmF0ZVRoaXMpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICB2YXIgY2FsbGJhY2tzID0gcHJpdmF0ZVRoaXNbdHlwZV07XG5cbiAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBwcml2YXRlVGhpc1t0eXBlXSA9IFtjYWxsYmFja107XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgaWYgKGNhbGxiYWNrID09PSBjYWxsYmFja3NbaV0pIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0dXJuIGNhbGxiYWNrcy5sZW5ndGg7XG59O1xuXG52YXIgX2Rpc3BhdGNoQ2FsbGJhY2sgPSBmdW5jdGlvbiBfZGlzcGF0Y2hDYWxsYmFjayh0YXJnZXQsIHR5cGUpIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IFtdO1xuXG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0YXJnZXQpO1xuXG4gIGlmIChwcml2YXRlVGhpcykge1xuICAgIHZhciBjYWxsYmFja3MgPSBwcml2YXRlVGhpc1t0eXBlXSB8fCBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0YXJnZXQsIGFyZ3MpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gSW5uZXJBdWRpb0NvbnRleHQoKSB7XG4gIHRoaXMuc3RhcnRUaW1lID0gMDtcbiAgdGhpcy5hdXRvcGxheSA9IGZhbHNlO1xuXG4gIF93ZWFrTWFwLnNldCh0aGlzLCB7XG4gICAgc3JjOiBcIlwiLFxuICAgIHZvbHVtZTogMSxcbiAgICBsb29wOiBmYWxzZVxuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJsb29wXCIsIHtcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdmFsdWUgPSAhIXZhbHVlO1xuXG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIGlmIChwcml2YXRlVGhpcykge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIF9hdWRpb0VuZ2luZS5zZXRMb29wKGF1ZGlvSUQsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGVUaGlzLmxvb3AgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICByZXR1cm4gcHJpdmF0ZVRoaXMgPyBwcml2YXRlVGhpcy5sb29wIDogZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwidm9sdW1lXCIsIHtcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBpZiAodmFsdWUgPCAwKSB7XG4gICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID4gMSkge1xuICAgICAgICAgIHZhbHVlID0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIGlmIChwcml2YXRlVGhpcykge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIF9hdWRpb0VuZ2luZS5zZXRWb2x1bWUoYXVkaW9JRCwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZVRoaXMudm9sdW1lID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgcmV0dXJuIHByaXZhdGVUaGlzID8gcHJpdmF0ZVRoaXMudm9sdW1lIDogMTtcbiAgICB9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJzcmNcIiwge1xuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIGlmICghcHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgb2xkU3JjID0gcHJpdmF0ZVRoaXMuc3JjO1xuICAgICAgcHJpdmF0ZVRoaXMuc3JjID0gdmFsdWU7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDAgJiYgX2F1ZGlvRW5naW5lLmdldFN0YXRlKGF1ZGlvSUQpID09PSBfU1RBVEUuUEFVU0VEICYmIG9sZFNyYyAhPT0gdmFsdWUpIHtcbiAgICAgICAgICBfYXVkaW9FbmdpbmUuc3RvcChhdWRpb0lEKTtcblxuICAgICAgICAgIHByaXZhdGVUaGlzLmF1ZGlvSUQgPSAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBfYXVkaW9FbmdpbmUucHJlbG9hZCh2YWx1ZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc3JjID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfQ0FOUExBWV9DQUxMQkFDSyk7XG5cbiAgICAgICAgICAgICAgaWYgKHNlbGYuYXV0b3BsYXkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnBsYXkoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICByZXR1cm4gcHJpdmF0ZVRoaXMgPyBwcml2YXRlVGhpcy5zcmMgOiBcIlwiO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImR1cmF0aW9uXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIF9hdWRpb0VuZ2luZS5nZXREdXJhdGlvbihhdWRpb0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gTmFOO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQoKSB7fVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiY3VycmVudFRpbWVcIiwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgICAgICByZXR1cm4gX2F1ZGlvRW5naW5lLmdldEN1cnJlbnRUaW1lKGF1ZGlvSUQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAwO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQoKSB7fVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwicGF1c2VkXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIF9hdWRpb0VuZ2luZS5nZXRTdGF0ZShhdWRpb0lEKSA9PT0gX1NUQVRFLlBBVVNFRDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KCkge31cbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImJ1ZmZlcmVkXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIF9hdWRpb0VuZ2luZS5nZXRCdWZmZXJlZChhdWRpb0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KCkge31cbiAgfSk7XG59XG5cbnZhciBfcHJvdG90eXBlID0gSW5uZXJBdWRpb0NvbnRleHQucHJvdG90eXBlO1xuXG5fcHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICBfYXVkaW9FbmdpbmUuc3RvcChhdWRpb0lEKTtcblxuICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IC0xO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfU1RPUF9DQUxMQkFDSyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZVRoaXNbX0NBTlBMQVlfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX0VOREVEX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19FUlJPUl9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfUEFVU0VfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1BMQVlfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1NFRUtFRF9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfU0VFS0lOR19DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfU1RPUF9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfVElNRV9VUERBVEVfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1dBSVRJTkdfQ0FMTEJBQ0tdID0gW107XG4gICAgY2xlYXJJbnRlcnZhbChwcml2YXRlVGhpcy5pbnRlcnZhbElEKTtcbiAgfVxufTtcblxuX3Byb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgaWYgKCFwcml2YXRlVGhpcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBzcmMgPSBwcml2YXRlVGhpcy5zcmM7XG4gIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICBpZiAodHlwZW9mIHNyYyAhPT0gXCJzdHJpbmdcIiB8fCBzcmMgPT09IFwiXCIpIHtcbiAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfRVJST1JfQ0FMTEJBQ0ssIFt7XG4gICAgICBlcnJNc2c6IFwiaW52YWxpZCBzcmNcIixcbiAgICAgIGVyckNvZGU6IF9FUlJPUl9DT0RFLkVSUk9SX0ZJTEVcbiAgICB9XSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgaWYgKF9hdWRpb0VuZ2luZS5nZXRTdGF0ZShhdWRpb0lEKSA9PT0gX1NUQVRFLlBBVVNFRCkge1xuICAgICAgX2F1ZGlvRW5naW5lLnJlc3VtZShhdWRpb0lEKTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1BMQVlfQ0FMTEJBQ0spO1xuXG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIF9hdWRpb0VuZ2luZS5zdG9wKGF1ZGlvSUQpO1xuXG4gICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG4gICAgfVxuICB9XG5cbiAgYXVkaW9JRCA9IF9hdWRpb0VuZ2luZS5wbGF5KHNyYywgdGhpcy5sb29wLCB0aGlzLnZvbHVtZSk7XG5cbiAgaWYgKGF1ZGlvSUQgPT09IC0xKSB7XG4gICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX0VSUk9SX0NBTExCQUNLLCBbe1xuICAgICAgZXJyTXNnOiBcInVua25vd25cIixcbiAgICAgIGVyckNvZGU6IF9FUlJPUl9DT0RFLkVSUk9SX1VOS05PV05cbiAgICB9XSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBwcml2YXRlVGhpcy5hdWRpb0lEID0gYXVkaW9JRDtcblxuICBpZiAodHlwZW9mIHRoaXMuc3RhcnRUaW1lID09PSBcIm51bWJlclwiICYmIHRoaXMuc3RhcnRUaW1lID4gMCkge1xuICAgIF9hdWRpb0VuZ2luZS5zZXRDdXJyZW50VGltZShhdWRpb0lELCB0aGlzLnN0YXJ0VGltZSk7XG4gIH1cblxuICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfV0FJVElOR19DQUxMQkFDSyk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIF9hdWRpb0VuZ2luZS5zZXRDYW5QbGF5Q2FsbGJhY2soYXVkaW9JRCwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzcmMgPT09IHNlbGYuc3JjKSB7XG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfQ0FOUExBWV9DQUxMQkFDSyk7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9QTEFZX0NBTExCQUNLKTtcbiAgICB9XG4gIH0pO1xuXG4gIF9hdWRpb0VuZ2luZS5zZXRXYWl0aW5nQ2FsbGJhY2soYXVkaW9JRCwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzcmMgPT09IHNlbGYuc3JjKSB7XG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfV0FJVElOR19DQUxMQkFDSyk7XG4gICAgfVxuICB9KTtcblxuICBfYXVkaW9FbmdpbmUuc2V0RXJyb3JDYWxsYmFjayhhdWRpb0lELCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNyYyA9PT0gc2VsZi5zcmMpIHtcbiAgICAgIHByaXZhdGVUaGlzLmF1ZGlvSUQgPSAtMTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX0VSUk9SX0NBTExCQUNLKTtcbiAgICB9XG4gIH0pO1xuXG4gIF9hdWRpb0VuZ2luZS5zZXRGaW5pc2hDYWxsYmFjayhhdWRpb0lELCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNyYyA9PT0gc2VsZi5zcmMpIHtcbiAgICAgIHByaXZhdGVUaGlzLmF1ZGlvSUQgPSAtMTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX0VOREVEX0NBTExCQUNLKTtcbiAgICB9XG4gIH0pO1xufTtcblxuX3Byb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gIGlmIChwcml2YXRlVGhpcykge1xuICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgIF9hdWRpb0VuZ2luZS5wYXVzZShhdWRpb0lEKTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1BBVVNFX0NBTExCQUNLKTtcbiAgICB9XG4gIH1cbn07XG5cbl9wcm90b3R5cGUuc2VlayA9IGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgaWYgKHByaXZhdGVUaGlzICYmIHR5cGVvZiBwb3NpdGlvbiA9PT0gXCJudW1iZXJcIiAmJiBwb3NpdGlvbiA+PSAwKSB7XG4gICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgX2F1ZGlvRW5naW5lLnNldEN1cnJlbnRUaW1lKGF1ZGlvSUQsIHBvc2l0aW9uKTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1NFRUtJTkdfQ0FMTEJBQ0spO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfU0VFS0VEX0NBTExCQUNLKTtcbiAgICB9XG4gIH1cbn07XG5cbl9wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gIGlmIChwcml2YXRlVGhpcykge1xuICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgIF9hdWRpb0VuZ2luZS5zdG9wKGF1ZGlvSUQpO1xuXG4gICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9TVE9QX0NBTExCQUNLKTtcbiAgICB9XG4gIH1cbn07XG5cbl9wcm90b3R5cGUub2ZmQ2FucGxheSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX0NBTlBMQVlfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub2ZmRW5kZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9FTkRFRF9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vZmZFcnJvciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX0VSUk9SX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9mZlBhdXNlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfUEFVU0VfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub2ZmUGxheSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX1BMQVlfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub2ZmU2Vla2VkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfU0VFS0VEX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9mZlNlZWtpbmcgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9TRUVLSU5HX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9mZlN0b3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9TVE9QX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9mZlRpbWVVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdmFyIHJlc3VsdCA9IF9vZmZDYWxsYmFjayh0aGlzLCBfVElNRV9VUERBVEVfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcblxuICBpZiAocmVzdWx0ID09PSAxKSB7XG4gICAgY2xlYXJJbnRlcnZhbChfd2Vha01hcC5nZXQodGhpcykuaW50ZXJ2YWxJRCk7XG4gIH1cbn07XG5cbl9wcm90b3R5cGUub2ZmV2FpdGluZyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX1dBSVRJTkdfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25DYW5wbGF5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9DQU5QTEFZX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uRW5kZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX0VOREVEX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uRXJyb3IgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX0VSUk9SX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uUGF1c2UgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX1BBVVNFX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uUGxheSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfUExBWV9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vblNlZWtlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfU0VFS0VEX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uU2Vla2luZyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBcInNlZWtpbmdDYWxsYmFja3NcIiwgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX1NUT1BfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25UaW1lVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHZhciByZXN1bHQgPSBfb25DYWxsYmFjayh0aGlzLCBfVElNRV9VUERBVEVfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcblxuICBpZiAocmVzdWx0ID09PSAxKSB7XG4gICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBpbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHNlbGYpO1xuXG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDAgJiYgX2F1ZGlvRW5naW5lLmdldFN0YXRlKGF1ZGlvSUQpID09PSBfU1RBVEUuUExBWUlORykge1xuICAgICAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9USU1FX1VQREFURV9DQUxMQkFDSyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJRCk7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgICBwcml2YXRlVGhpcy5pbnRlcnZhbElEID0gaW50ZXJ2YWxJRDtcbiAgfVxufTtcblxuX3Byb3RvdHlwZS5vbldhaXRpbmcgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX1dBSVRJTkdfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbmZ1bmN0aW9uIF9kZWZhdWx0KEF1ZGlvRW5naW5lKSB7XG4gIGlmIChfYXVkaW9FbmdpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgIF9hdWRpb0VuZ2luZSA9IE9iamVjdC5hc3NpZ24oe30sIEF1ZGlvRW5naW5lKTtcbiAgICBPYmplY3Qua2V5cyhBdWRpb0VuZ2luZSkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBBdWRpb0VuZ2luZVtuYW1lXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIEF1ZGlvRW5naW5lW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIkF1ZGlvRW5naW5lLlwiICsgbmFtZSArIFwiIGlzIGRlcHJlY2F0ZWRcIik7XG4gICAgICAgICAgcmV0dXJuIF9hdWRpb0VuZ2luZVtuYW1lXS5hcHBseShBdWRpb0VuZ2luZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBuZXcgSW5uZXJBdWRpb0NvbnRleHQoKTtcbn1cblxuO1xuXG59LHt9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvblNob3dcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvbkhpZGVcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvZmZTaG93XCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib2ZmSGlkZVwiLCBfcnQsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIxfV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwibG9hZFN1YnBhY2thZ2VcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImVudlwiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImdldFN5c3RlbUluZm9cIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRTeXN0ZW1JbmZvU3luY1wiLCBfcnQsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIxfV0sNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9qc2IgPSB3aW5kb3cuanNiO1xuXG5pZiAoIV9qc2IpIHtcbiAgX2pzYiA9IHt9O1xufVxuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxudmFyIF90b3VjaGVzID0gW107XG5cbnZhciBfZ2V0VG91Y2hJbmRleCA9IGZ1bmN0aW9uIF9nZXRUb3VjaEluZGV4KHRvdWNoKSB7XG4gIHZhciBlbGVtZW50O1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBfdG91Y2hlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICBlbGVtZW50ID0gX3RvdWNoZXNbaW5kZXhdO1xuXG4gICAgaWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IGVsZW1lbnQuaWRlbnRpZmllcikge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMTtcbn07XG5cbnZhciBfY29weU9iamVjdCA9IGZ1bmN0aW9uIF9jb3B5T2JqZWN0KGZyb21PYmosIHRvT2JqZWN0KSB7XG4gIGZvciAodmFyIGtleSBpbiBmcm9tT2JqKSB7XG4gICAgaWYgKGZyb21PYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdG9PYmplY3Rba2V5XSA9IGZyb21PYmpba2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBfbGlzdGVuZXJNYXAgPSB7XG4gIFwidG91Y2hzdGFydFwiOiBbXSxcbiAgXCJ0b3VjaG1vdmVcIjogW10sXG4gIFwidG91Y2hlbmRcIjogW10sXG4gIFwidG91Y2hjYW5jZWxcIjogW11cbn07XG5cbmZ1bmN0aW9uIF9hZGRMaXN0ZW5lcihrZXksIHZhbHVlKSB7XG4gIHZhciBsaXN0ZW5lckFyciA9IF9saXN0ZW5lck1hcFtrZXldO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMCwgbGVuZ3RoID0gbGlzdGVuZXJBcnIubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgIGlmICh2YWx1ZSA9PT0gbGlzdGVuZXJBcnJbaW5kZXhdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgbGlzdGVuZXJBcnIucHVzaCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIF9yZW1vdmVMaXN0ZW5lcihrZXksIHZhbHVlKSB7XG4gIHZhciBsaXN0ZW5lckFyciA9IF9saXN0ZW5lck1hcFtrZXldIHx8IFtdO1xuICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJBcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7ICsraW5kZXgpIHtcbiAgICBpZiAodmFsdWUgPT09IGxpc3RlbmVyQXJyW2luZGV4XSkge1xuICAgICAgbGlzdGVuZXJBcnIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn1cblxudmFyIF9oYXNEZWxsV2l0aCA9IGZhbHNlO1xuXG52YXIgX3N5c3RlbUluZm8gPSBfcnQuZ2V0U3lzdGVtSW5mb1N5bmMoKTtcblxuaWYgKHdpbmRvdy5pbm5lcldpZHRoICYmIF9zeXN0ZW1JbmZvLndpbmRvd1dpZHRoICE9PSB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICBfaGFzRGVsbFdpdGggPSB0cnVlO1xufVxuXG52YXIgX3RvdWNoRXZlbnRIYW5kbGVyRmFjdG9yeSA9IGZ1bmN0aW9uIF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkodHlwZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGNoYW5nZWRUb3VjaGVzKSB7XG4gICAgaWYgKHR5cGVvZiBjaGFuZ2VkVG91Y2hlcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBfYWRkTGlzdGVuZXIodHlwZSwgY2hhbmdlZFRvdWNoZXMpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHRvdWNoRXZlbnQgPSBuZXcgVG91Y2hFdmVudCh0eXBlKTtcbiAgICB2YXIgaW5kZXg7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJ0b3VjaHN0YXJ0XCIpIHtcbiAgICAgIGNoYW5nZWRUb3VjaGVzLmZvckVhY2goZnVuY3Rpb24gKHRvdWNoKSB7XG4gICAgICAgIGluZGV4ID0gX2dldFRvdWNoSW5kZXgodG91Y2gpO1xuXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgX2NvcHlPYmplY3QodG91Y2gsIF90b3VjaGVzW2luZGV4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRtcCA9IHt9O1xuXG4gICAgICAgICAgX2NvcHlPYmplY3QodG91Y2gsIHRtcCk7XG5cbiAgICAgICAgICBfdG91Y2hlcy5wdXNoKHRtcCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJ0b3VjaG1vdmVcIikge1xuICAgICAgY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpbmRleCA9IF9nZXRUb3VjaEluZGV4KGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgX2NvcHlPYmplY3QoZWxlbWVudCwgX3RvdWNoZXNbaW5kZXhdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInRvdWNoZW5kXCIgfHwgdHlwZSA9PT0gXCJ0b3VjaGNhbmNlbFwiKSB7XG4gICAgICBjaGFuZ2VkVG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGluZGV4ID0gX2dldFRvdWNoSW5kZXgoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICBfdG91Y2hlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgdG91Y2hlcyA9IFtdLmNvbmNhdChfdG91Y2hlcyk7XG4gICAgdmFyIF9jaGFuZ2VkVG91Y2hlcyA9IFtdO1xuICAgIGNoYW5nZWRUb3VjaGVzLmZvckVhY2goZnVuY3Rpb24gKHRvdWNoKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gdG91Y2hlcy5sZW5ndGg7XG5cbiAgICAgIGZvciAodmFyIF9pbmRleCA9IDA7IF9pbmRleCA8IGxlbmd0aDsgKytfaW5kZXgpIHtcbiAgICAgICAgdmFyIF90b3VjaCA9IHRvdWNoZXNbX2luZGV4XTtcblxuICAgICAgICBpZiAodG91Y2guaWRlbnRpZmllciA9PT0gX3RvdWNoLmlkZW50aWZpZXIpIHtcbiAgICAgICAgICBfY2hhbmdlZFRvdWNoZXMucHVzaChfdG91Y2gpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9jaGFuZ2VkVG91Y2hlcy5wdXNoKHRvdWNoKTtcbiAgICB9KTtcbiAgICB0b3VjaEV2ZW50LnRvdWNoZXMgPSB0b3VjaGVzO1xuICAgIHRvdWNoRXZlbnQudGFyZ2V0VG91Y2hlcyA9IHRvdWNoZXM7XG4gICAgdG91Y2hFdmVudC5jaGFuZ2VkVG91Y2hlcyA9IF9jaGFuZ2VkVG91Y2hlcztcblxuICAgIGlmIChfaGFzRGVsbFdpdGgpIHtcbiAgICAgIHRvdWNoZXMuZm9yRWFjaChmdW5jdGlvbiAodG91Y2gpIHtcbiAgICAgICAgdG91Y2guY2xpZW50WCAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgdG91Y2guY2xpZW50WSAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgdG91Y2gucGFnZVggLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIHRvdWNoLnBhZ2VZIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0eXBlID09PSBcInRvdWNoY2FuY2VsXCIgfHwgdHlwZSA9PT0gXCJ0b3VjaGVuZFwiKSB7XG4gICAgICAgIF9jaGFuZ2VkVG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uICh0b3VjaCkge1xuICAgICAgICAgIHRvdWNoLmNsaWVudFggLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgdG91Y2guY2xpZW50WSAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICB0b3VjaC5wYWdlWCAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICB0b3VjaC5wYWdlWSAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpc3RlbmVyQXJyID0gX2xpc3RlbmVyTWFwW3R5cGVdO1xuICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lckFyci5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBfaW5kZXgyID0gMDsgX2luZGV4MiA8IGxlbmd0aDsgX2luZGV4MisrKSB7XG4gICAgICBsaXN0ZW5lckFycltfaW5kZXgyXSh0b3VjaEV2ZW50KTtcbiAgICB9XG4gIH07XG59O1xuXG5pZiAoX3J0Lm9uVG91Y2hTdGFydCkge1xuICByYWwub25Ub3VjaFN0YXJ0ID0gX3J0Lm9uVG91Y2hTdGFydDtcbiAgcmFsLm9mZlRvdWNoU3RhcnQgPSBfcnQub2ZmVG91Y2hTdGFydDtcbn0gZWxzZSB7XG4gIF9qc2Iub25Ub3VjaFN0YXJ0ID0gX3RvdWNoRXZlbnRIYW5kbGVyRmFjdG9yeSgndG91Y2hzdGFydCcpO1xuXG4gIF9qc2Iub2ZmVG91Y2hTdGFydCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIF9yZW1vdmVMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJhbC5vblRvdWNoU3RhcnQgPSBfanNiLm9uVG91Y2hTdGFydC5iaW5kKF9qc2IpO1xuICByYWwub2ZmVG91Y2hTdGFydCA9IF9qc2Iub2ZmVG91Y2hTdGFydC5iaW5kKF9qc2IpO1xufVxuXG5pZiAoX3J0Lm9uVG91Y2hNb3ZlKSB7XG4gIHJhbC5vblRvdWNoTW92ZSA9IF9ydC5vblRvdWNoTW92ZTtcbiAgcmFsLm9mZlRvdWNoTW92ZSA9IF9ydC5vZmZUb3VjaE1vdmU7XG59IGVsc2Uge1xuICBfanNiLm9uVG91Y2hNb3ZlID0gX3RvdWNoRXZlbnRIYW5kbGVyRmFjdG9yeSgndG91Y2htb3ZlJyk7XG5cbiAgX2pzYi5vZmZUb3VjaE1vdmUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBfcmVtb3ZlTGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJhbC5vblRvdWNoTW92ZSA9IF9qc2Iub25Ub3VjaE1vdmUuYmluZChfanNiKTtcbiAgcmFsLm9mZlRvdWNoTW92ZSA9IF9qc2Iub2ZmVG91Y2hNb3ZlLmJpbmQoX2pzYik7XG59XG5cbmlmIChfcnQub25Ub3VjaENhbmNlbCkge1xuICByYWwub25Ub3VjaENhbmNlbCA9IF9ydC5vblRvdWNoQ2FuY2VsO1xuICByYWwub2ZmVG91Y2hDYW5jZWwgPSBfcnQub2ZmVG91Y2hDYW5jZWw7XG59IGVsc2Uge1xuICBfanNiLm9uVG91Y2hDYW5jZWwgPSBfdG91Y2hFdmVudEhhbmRsZXJGYWN0b3J5KCd0b3VjaGNhbmNlbCcpO1xuXG4gIF9qc2Iub2ZmVG91Y2hDYW5jZWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBfcmVtb3ZlTGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgcmFsLm9uVG91Y2hDYW5jZWwgPSBfanNiLm9uVG91Y2hDYW5jZWwuYmluZChfanNiKTtcbiAgcmFsLm9mZlRvdWNoQ2FuY2VsID0gX2pzYi5vZmZUb3VjaENhbmNlbC5iaW5kKF9qc2IpO1xufVxuXG5pZiAoX3J0Lm9uVG91Y2hFbmQpIHtcbiAgcmFsLm9uVG91Y2hFbmQgPSBfcnQub25Ub3VjaEVuZDtcbiAgcmFsLm9mZlRvdWNoRW5kID0gX3J0Lm9mZlRvdWNoRW5kO1xufSBlbHNlIHtcbiAgX2pzYi5vblRvdWNoRW5kID0gX3RvdWNoRXZlbnRIYW5kbGVyRmFjdG9yeSgndG91Y2hlbmQnKTtcblxuICBfanNiLm9mZlRvdWNoRW5kID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgX3JlbW92ZUxpc3RlbmVyKFwidG91Y2hlbmRcIiwgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJhbC5vblRvdWNoRW5kID0gX2pzYi5vblRvdWNoRW5kLmJpbmQoX2pzYik7XG4gIHJhbC5vZmZUb3VjaEVuZCA9IF9qc2Iub2ZmVG91Y2hFbmQuYmluZChfanNiKTtcbn1cblxufSx7fV0sNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxudmFyIF9saXN0ZW5lcnMgPSBbXTtcbnJhbC5kZXZpY2UgPSByYWwuZGV2aWNlIHx8IHt9O1xuXG5pZiAoX3J0Lm9mZkFjY2VsZXJvbWV0ZXJDaGFuZ2UpIHtcbiAgaWYgKF9ydC5fY29tcGF0aWJsZU1vZGUgPT09IDEpIHtcbiAgICB2YXIgX3N5c3RlbUluZm8gPSBfcnQuZ2V0U3lzdGVtSW5mb1N5bmMoKTtcblxuICAgIHZhciBfaXNBbmRyb2lkID0gX3N5c3RlbUluZm8ucGxhdGZvcm0udG9Mb3dlckNhc2UoKSA9PT0gXCJhbmRyb2lkXCI7XG5cbiAgICB2YXIgX2NvbXBhdGlibGVBY2NlbGVyb21ldGVyQ2hhbmdlID0gZnVuY3Rpb24gX2NvbXBhdGlibGVBY2NlbGVyb21ldGVyQ2hhbmdlKGUpIHtcbiAgICAgIGlmIChfaXNBbmRyb2lkKSB7XG4gICAgICAgIGUueCAvPSAtMTA7XG4gICAgICAgIGUueSAvPSAtMTA7XG4gICAgICAgIGUueiAvPSAtMTA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlLnggLz0gMTA7XG4gICAgICAgIGUueSAvPSAxMDtcbiAgICAgICAgZS56IC89IDEwO1xuICAgICAgfVxuXG4gICAgICBfbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGxpc3RlbmVyKGUpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBfb25BY2NlbGVyb21ldGVyQ2hhbmdlID0gX3J0Lm9uQWNjZWxlcm9tZXRlckNoYW5nZS5iaW5kKF9ydCk7XG5cbiAgICByYWwub25BY2NlbGVyb21ldGVyQ2hhbmdlID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdmFyIGxlbmd0aCA9IF9saXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgICAgICBpZiAobGlzdGVuZXIgPT09IF9saXN0ZW5lcnNbaW5kZXhdKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgICBpZiAoX2xpc3RlbmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBfb25BY2NlbGVyb21ldGVyQ2hhbmdlKF9jb21wYXRpYmxlQWNjZWxlcm9tZXRlckNoYW5nZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIF9vZmZBY2NlbGVyb21ldGVyQ2hhbmdlID0gX3J0Lm9mZkFjY2VsZXJvbWV0ZXJDaGFuZ2UuYmluZChfcnQpO1xuXG4gICAgcmFsLm9mZkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgIHZhciBsZW5ndGggPSBfbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgKytpbmRleCkge1xuICAgICAgICBpZiAobGlzdGVuZXIgPT09IF9saXN0ZW5lcnNbaW5kZXhdKSB7XG4gICAgICAgICAgX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgICAgaWYgKF9saXN0ZW5lcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBfb2ZmQWNjZWxlcm9tZXRlckNoYW5nZShfY29tcGF0aWJsZUFjY2VsZXJvbWV0ZXJDaGFuZ2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByYWwub25BY2NlbGVyb21ldGVyQ2hhbmdlID0gX3J0Lm9uQWNjZWxlcm9tZXRlckNoYW5nZS5iaW5kKF9ydCk7XG4gICAgcmFsLm9mZkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBfcnQub2ZmQWNjZWxlcm9tZXRlckNoYW5nZS5iaW5kKF9ydCk7XG4gIH1cblxuICByYWwuc3RvcEFjY2VsZXJvbWV0ZXIgPSBfcnQuc3RvcEFjY2VsZXJvbWV0ZXIuYmluZChfcnQpO1xuXG4gIHZhciBfc3RhcnRBY2NlbGVyb21ldGVyID0gX3J0LnN0YXJ0QWNjZWxlcm9tZXRlci5iaW5kKF9ydCk7XG5cbiAgcmFsLnN0YXJ0QWNjZWxlcm9tZXRlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gX3N0YXJ0QWNjZWxlcm9tZXRlcihPYmplY3QuYXNzaWduKHtcbiAgICAgIHR5cGU6IFwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVwiXG4gICAgfSwgb2JqKSk7XG4gIH07XG59IGVsc2Uge1xuICByYWwub25BY2NlbGVyb21ldGVyQ2hhbmdlID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgaWYgKHR5cGVvZiBsaXN0ZW5lciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gX2xpc3RlbmVycy5sZW5ndGg7XG5cbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgICAgaWYgKGxpc3RlbmVyID09PSBfbGlzdGVuZXJzW2luZGV4XSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICByYWwub2ZmQWNjZWxlcm9tZXRlckNoYW5nZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHZhciBsZW5ndGggPSBfbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgIGlmIChsaXN0ZW5lciA9PT0gX2xpc3RlbmVyc1tpbmRleF0pIHtcbiAgICAgICAgX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIF9zeXN0ZW1JbmZvMiA9IF9ydC5nZXRTeXN0ZW1JbmZvU3luYygpO1xuXG4gIHZhciBfaXNBbmRyb2lkMiA9IF9zeXN0ZW1JbmZvMi5wbGF0Zm9ybS50b0xvd2VyQ2FzZSgpID09PSBcImFuZHJvaWRcIjtcblxuICBqc2IuZGV2aWNlLmRpc3BhdGNoRGV2aWNlTW90aW9uRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgYWNjZWxlcmF0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQuX2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkpO1xuXG4gICAgaWYgKF9pc0FuZHJvaWQyKSB7XG4gICAgICBhY2NlbGVyYXRpb24ueCAvPSAtMTA7XG4gICAgICBhY2NlbGVyYXRpb24ueSAvPSAtMTA7XG4gICAgICBhY2NlbGVyYXRpb24ueiAvPSAtMTA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY2VsZXJhdGlvbi54IC89IDEwO1xuICAgICAgYWNjZWxlcmF0aW9uLnkgLz0gMTA7XG4gICAgICBhY2NlbGVyYXRpb24ueiAvPSAxMDtcbiAgICB9XG5cbiAgICBfbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICBsaXN0ZW5lcih7XG4gICAgICAgIHg6IGFjY2VsZXJhdGlvbi54LFxuICAgICAgICB5OiBhY2NlbGVyYXRpb24ueSxcbiAgICAgICAgejogYWNjZWxlcmF0aW9uLnpcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJhbC5zdG9wQWNjZWxlcm9tZXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBqc2IuZGV2aWNlLnNldE1vdGlvbkVuYWJsZWQoZmFsc2UpO1xuICB9O1xuXG4gIHJhbC5zdGFydEFjY2VsZXJvbWV0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAganNiLmRldmljZS5zZXRNb3Rpb25FbmFibGVkKHRydWUpO1xuICB9O1xufVxuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImdldEJhdHRlcnlJbmZvXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZ2V0QmF0dGVyeUluZm9TeW5jXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRGaWxlU3lzdGVtTWFuYWdlclwiLCBfcnQsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIxfV0sMTA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL3V0aWxcIikpO1xuXG52YXIgX2ZlYXR1cmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi9mZWF0dXJlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmlmICh3aW5kb3cuanNiKSB7XG4gIHdpbmRvdy5yYWwgPSBPYmplY3QuYXNzaWduKHt9LCB3aW5kb3cuanNiKTtcbn0gZWxzZSB7XG4gIHdpbmRvdy5yYWwgPSB7fTtcbn1cblxucmVxdWlyZShcIi4vYmFzZS9saWZlY3ljbGVcIik7XG5cbnJlcXVpcmUoXCIuL2Jhc2Uvc3VicGFja2FnZVwiKTtcblxucmVxdWlyZShcIi4vYmFzZS9zeXN0ZW0taW5mb1wiKTtcblxucmVxdWlyZShcIi4vYmFzZS90b3VjaC1ldmVudFwiKTtcblxucmVxdWlyZShcIi4vZGV2aWNlL2FjY2VsZXJvbWV0ZXJcIik7XG5cbnJlcXVpcmUoXCIuL2RldmljZS9iYXR0ZXJ5XCIpO1xuXG5yZXF1aXJlKFwiLi9maWxlL2ZpbGUtc3lzdGVtLW1hbmFnZXJcIik7XG5cbnJlcXVpcmUoXCIuL2ludGVyZmFjZS9rZXlib2FyZFwiKTtcblxucmVxdWlyZShcIi4vaW50ZXJmYWNlL3dpbmRvd1wiKTtcblxucmVxdWlyZShcIi4vbWVkaWEvYXVkaW9cIik7XG5cbnJlcXVpcmUoXCIuL21lZGlhL3ZpZGVvXCIpO1xuXG5yZXF1aXJlKFwiLi9uZXR3b3JrL2Rvd25sb2FkXCIpO1xuXG5yZXF1aXJlKFwiLi9yZW5kZXJpbmcvY2FudmFzXCIpO1xuXG5yZXF1aXJlKFwiLi9yZW5kZXJpbmcvd2ViZ2xcIik7XG5cbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9mb250XCIpO1xuXG5yZXF1aXJlKFwiLi9yZW5kZXJpbmcvZnJhbWVcIik7XG5cbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9pbWFnZVwiKTtcblxuZm9yICh2YXIga2V5IGluIF9mZWF0dXJlW1wiZGVmYXVsdFwiXSkge1xuICBpZiAoa2V5ID09PSBcInNldEZlYXR1cmVcIiB8fCBrZXkgPT09IFwicmVnaXN0ZXJGZWF0dXJlUHJvcGVydHlcIiB8fCBrZXkgPT09IFwidW5yZWdpc3RlckZlYXR1cmVQcm9wZXJ0eVwiKSB7XG4gICAgY29udGludWU7XG4gIH1cblxuICBpZiAoX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICBfdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oa2V5LCBfZmVhdHVyZVtcImRlZmF1bHRcIl0sIHJhbCk7XG4gIH1cbn1cblxufSx7XCIuLi9mZWF0dXJlXCI6MSxcIi4uL3V0aWxcIjoyMSxcIi4vYmFzZS9saWZlY3ljbGVcIjozLFwiLi9iYXNlL3N1YnBhY2thZ2VcIjo0LFwiLi9iYXNlL3N5c3RlbS1pbmZvXCI6NSxcIi4vYmFzZS90b3VjaC1ldmVudFwiOjYsXCIuL2RldmljZS9hY2NlbGVyb21ldGVyXCI6NyxcIi4vZGV2aWNlL2JhdHRlcnlcIjo4LFwiLi9maWxlL2ZpbGUtc3lzdGVtLW1hbmFnZXJcIjo5LFwiLi9pbnRlcmZhY2Uva2V5Ym9hcmRcIjoxMSxcIi4vaW50ZXJmYWNlL3dpbmRvd1wiOjEyLFwiLi9tZWRpYS9hdWRpb1wiOjEzLFwiLi9tZWRpYS92aWRlb1wiOjE0LFwiLi9uZXR3b3JrL2Rvd25sb2FkXCI6MTUsXCIuL3JlbmRlcmluZy9jYW52YXNcIjoxNixcIi4vcmVuZGVyaW5nL2ZvbnRcIjoxNyxcIi4vcmVuZGVyaW5nL2ZyYW1lXCI6MTgsXCIuL3JlbmRlcmluZy9pbWFnZVwiOjE5LFwiLi9yZW5kZXJpbmcvd2ViZ2xcIjoyMH1dLDExOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvbktleWJvYXJkSW5wdXRcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvbktleWJvYXJkQ29uZmlybVwiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9uS2V5Ym9hcmRDb21wbGV0ZVwiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9mZktleWJvYXJkSW5wdXRcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvZmZLZXlib2FyZENvbmZpcm1cIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvZmZLZXlib2FyZENvbXBsZXRlXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiaGlkZUtleWJvYXJkXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwic2hvd0tleWJvYXJkXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwidXBkYXRlS2V5Ym9hcmRcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDEyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxudmFyIF9vbldpbmRvd1Jlc2l6ZSA9IF9ydC5vbldpbmRvd1Jlc2l6ZTtcblxucmFsLm9uV2luZG93UmVzaXplID0gZnVuY3Rpb24gKGNhbGxCYWNrKSB7XG4gIF9vbldpbmRvd1Jlc2l6ZShmdW5jdGlvbiAoc2l6ZSkge1xuICAgIGNhbGxCYWNrKHNpemUud2lkdGggfHwgc2l6ZS53aW5kb3dXaWR0aCwgc2l6ZS5oZWlnaHQgfHwgc2l6ZS53aW5kb3dIZWlnaHQpO1xuICB9KTtcbn07XG5cbndpbmRvdy5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnNvbGUud2Fybignd2luZG93LnJlc2l6ZSgpIGlzIGRlcHJlY2F0ZWQnKTtcbn07XG5cbn0se31dLDEzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2lubmVyQ29udGV4dCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL2lubmVyLWNvbnRleHRcIikpO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJBdWRpb0VuZ2luZVwiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImNyZWF0ZUlubmVyQXVkaW9Db250ZXh0XCIsIF9ydCwgcmFsLCBmdW5jdGlvbiAoKSB7XG4gIGlmIChfcnQuQXVkaW9FbmdpbmUpIHtcbiAgICByYWwuY3JlYXRlSW5uZXJBdWRpb0NvbnRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKDAsIF9pbm5lckNvbnRleHRbXCJkZWZhdWx0XCJdKShfcnQuQXVkaW9FbmdpbmUpO1xuICAgIH07XG4gIH1cbn0pO1xuXG59LHtcIi4uLy4uL2lubmVyLWNvbnRleHRcIjoyLFwiLi4vLi4vdXRpbFwiOjIxfV0sMTQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImNyZWF0ZVZpZGVvXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSwxNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZG93bmxvYWRGaWxlXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSwxNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbnZhciBfZmVhdHVyZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL2ZlYXR1cmVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImNyZWF0ZUNhbnZhc1wiLCBfcnQsIHJhbCwgZnVuY3Rpb24gKCkge1xuICB2YXIgZmVhdHVyZVZhbHVlID0gXCJ1bnN1cHBvcnRlZFwiO1xuXG4gIGlmIChkb2N1bWVudCAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZmVhdHVyZVZhbHVlID0gXCJ3cmFwcGVyXCI7XG5cbiAgICByYWwuY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgfTtcbiAgfVxuXG4gIF9mZWF0dXJlW1wiZGVmYXVsdFwiXS5zZXRGZWF0dXJlKFwicmFsLmNyZWF0ZUNhbnZhc1wiLCBcInNwZWNcIiwgZmVhdHVyZVZhbHVlKTtcbn0pO1xuXG52YXIgX3J0X2dldEZlYXR1cmUgPSBfcnQuZ2V0RmVhdHVyZTtcbnZhciBfcnRfc2V0RmVhdHVyZSA9IF9ydC5zZXRGZWF0dXJlO1xuXG5fZmVhdHVyZVtcImRlZmF1bHRcIl0ucmVnaXN0ZXJGZWF0dXJlUHJvcGVydHkoX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkNBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0FMUEhBQkVUSUMubmFtZSwgZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIF9ydF9nZXRGZWF0dXJlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgdmFsdWUgPSBfcnRfZ2V0RmVhdHVyZShfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfQUxQSEFCRVRJQy5uYW1lKTtcblxuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIF9mZWF0dXJlW1wiZGVmYXVsdFwiXS5DQU5WQVNfQ09OVEVYVDJEX1RFWFRCQVNFTElORV9BTFBIQUJFVElDLmVuYWJsZTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9mZWF0dXJlW1wiZGVmYXVsdFwiXS5GRUFUVVJFX1VOU1VQUE9SVDtcbn0sIHVuZGVmaW5lZCk7XG5cbl9mZWF0dXJlW1wiZGVmYXVsdFwiXS5yZWdpc3RlckZlYXR1cmVQcm9wZXJ0eShfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfREVGQVVMVC5uYW1lLCBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgX3J0X2dldEZlYXR1cmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciB2YWx1ZSA9IF9ydF9nZXRGZWF0dXJlKF9mZWF0dXJlW1wiZGVmYXVsdFwiXS5DQU5WQVNfQ09OVEVYVDJEX1RFWFRCQVNFTElORV9ERUZBVUxULm5hbWUpO1xuXG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkNBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0RFRkFVTFQuYWxwaGFiZXRpYztcblxuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkNBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0RFRkFVTFQuYm90dG9tO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkZFQVRVUkVfVU5TVVBQT1JUO1xufSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgX3J0X3NldEZlYXR1cmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkNBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0RFRkFVTFQuYWxwaGFiZXRpYzpcbiAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfREVGQVVMVC5ib3R0b206XG4gICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3J0X3NldEZlYXR1cmUoX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkNBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0RFRkFVTFQubmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cbn0se1wiLi4vLi4vZmVhdHVyZVwiOjEsXCIuLi8uLi91dGlsXCI6MjF9XSwxNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwibG9hZEZvbnRcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDE4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxuaWYgKHdpbmRvdy5qc2IgJiYganNiLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCkge1xuICByYWwuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kID0ganNiLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZC5iaW5kKGpzYik7XG59IGVsc2UgaWYgKF9ydC5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQpIHtcbiAgcmFsLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCA9IF9ydC5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQuYmluZChfcnQpO1xufSBlbHNlIHtcbiAgcmFsLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiVGhlIHNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCBpcyBub3QgZGVmaW5lIVwiKTtcbiAgfTtcbn1cblxufSx7fV0sMTk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG52YXIgX2ZlYXR1cmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9mZWF0dXJlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJsb2FkSW1hZ2VEYXRhXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiY3JlYXRlSW1hZ2VcIiwgX3J0LCByYWwsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZlYXR1cmVWYWx1ZSA9IFwidW5zdXBwb3J0ZWRcIjtcblxuICBpZiAoZG9jdW1lbnQgJiYgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGZlYXR1cmVWYWx1ZSA9IFwid3JhcHBlclwiO1xuXG4gICAgcmFsLmNyZWF0ZUltYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWFnZVwiKTtcbiAgICB9O1xuICB9XG5cbiAgX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLnNldEZlYXR1cmUoXCJyYWwuY3JlYXRlSW1hZ2VcIiwgXCJzcGVjXCIsIGZlYXR1cmVWYWx1ZSk7XG59KTtcblxufSx7XCIuLi8uLi9mZWF0dXJlXCI6MSxcIi4uLy4uL3V0aWxcIjoyMX1dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5pZiAod2luZG93Ll9fZ2wpIHtcbiAgdmFyIGdsID0gd2luZG93Ll9fZ2w7XG4gIHZhciBfZ2xUZXhJbWFnZTJEID0gZ2wudGV4SW1hZ2UyRDtcblxuICBnbC50ZXhJbWFnZTJEID0gZnVuY3Rpb24gKHRhcmdldCwgbGV2ZWwsIGludGVybmFsZm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCBib3JkZXIsIGZvcm1hdCwgdHlwZSwgcGl4ZWxzKSB7XG4gICAgdmFyIGFyZ2MgPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gICAgaWYgKGFyZ2MgPT09IDYpIHtcbiAgICAgIHZhciBpbWFnZSA9IGJvcmRlcjtcbiAgICAgIHR5cGUgPSBoZWlnaHQ7XG4gICAgICBmb3JtYXQgPSB3aWR0aDtcblxuICAgICAgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICB2YXIgZXJyb3IgPSBjb25zb2xlLmVycm9yO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgICAgICBfZ2xUZXhJbWFnZTJELmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcblxuICAgICAgICBjb25zb2xlLmVycm9yID0gZXJyb3I7XG4gICAgICAgIGdsLnRleEltYWdlMkRfaW1hZ2UodGFyZ2V0LCBsZXZlbCwgaW1hZ2UuX2ltYWdlTWV0YSk7XG4gICAgICB9IGVsc2UgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgdmFyIF9lcnJvciA9IGNvbnNvbGUuZXJyb3I7XG5cbiAgICAgICAgY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgIF9nbFRleEltYWdlMkQuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBfZXJyb3I7XG4gICAgICAgIHZhciBjb250ZXh0MkQgPSBpbWFnZS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBnbC50ZXhJbWFnZTJEX2NhbnZhcyh0YXJnZXQsIGxldmVsLCBpbnRlcm5hbGZvcm1hdCwgZm9ybWF0LCB0eXBlLCBjb250ZXh0MkQpO1xuICAgICAgfSBlbHNlIGlmIChpbWFnZSBpbnN0YW5jZW9mIEltYWdlRGF0YSkge1xuICAgICAgICBfZ2xUZXhJbWFnZTJEKHRhcmdldCwgbGV2ZWwsIGludGVybmFsZm9ybWF0LCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0LCAwLCBmb3JtYXQsIHR5cGUsIGltYWdlLmRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgcGl4ZWwgYXJndW1lbnQgcGFzc2VkIHRvIGdsLnRleEltYWdlMkQhXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXJnYyA9PT0gOSkge1xuICAgICAgX2dsVGV4SW1hZ2UyRCh0YXJnZXQsIGxldmVsLCBpbnRlcm5hbGZvcm1hdCwgd2lkdGgsIGhlaWdodCwgYm9yZGVyLCBmb3JtYXQsIHR5cGUsIHBpeGVscyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJnbC50ZXhJbWFnZTJEOiBpbnZhbGlkIGFyZ3VtZW50IGNvdW50IVwiKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9nbFRleFN1YkltYWdlMkQgPSBnbC50ZXhTdWJJbWFnZTJEO1xuXG4gIGdsLnRleFN1YkltYWdlMkQgPSBmdW5jdGlvbiAodGFyZ2V0LCBsZXZlbCwgeG9mZnNldCwgeW9mZnNldCwgd2lkdGgsIGhlaWdodCwgZm9ybWF0LCB0eXBlLCBwaXhlbHMpIHtcbiAgICB2YXIgYXJnYyA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICBpZiAoYXJnYyA9PT0gNykge1xuICAgICAgdmFyIGltYWdlID0gZm9ybWF0O1xuICAgICAgdHlwZSA9IGhlaWdodDtcbiAgICAgIGZvcm1hdCA9IHdpZHRoO1xuXG4gICAgICBpZiAoaW1hZ2UgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgIHZhciBlcnJvciA9IGNvbnNvbGUuZXJyb3I7XG5cbiAgICAgICAgY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgIF9nbFRleFN1YkltYWdlMkQuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgZ2wudGV4U3ViSW1hZ2UyRF9pbWFnZSh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCBpbWFnZS5faW1hZ2VNZXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICB2YXIgX2Vycm9yMiA9IGNvbnNvbGUuZXJyb3I7XG5cbiAgICAgICAgY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgIF9nbFRleFN1YkltYWdlMkQuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBfZXJyb3IyO1xuICAgICAgICB2YXIgY29udGV4dDJEID0gaW1hZ2UuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgZ2wudGV4U3ViSW1hZ2UyRF9jYW52YXModGFyZ2V0LCBsZXZlbCwgeG9mZnNldCwgeW9mZnNldCwgZm9ybWF0LCB0eXBlLCBjb250ZXh0MkQpO1xuICAgICAgfSBlbHNlIGlmIChpbWFnZSBpbnN0YW5jZW9mIEltYWdlRGF0YSkge1xuICAgICAgICBfZ2xUZXhTdWJJbWFnZTJEKHRhcmdldCwgbGV2ZWwsIHhvZmZzZXQsIHlvZmZzZXQsIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQsIGZvcm1hdCwgdHlwZSwgaW1hZ2UuZGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBwaXhlbCBhcmd1bWVudCBwYXNzZWQgdG8gZ2wudGV4SW1hZ2UyRCFcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhcmdjID09PSA5KSB7XG4gICAgICBfZ2xUZXhTdWJJbWFnZTJEKHRhcmdldCwgbGV2ZWwsIHhvZmZzZXQsIHlvZmZzZXQsIHdpZHRoLCBoZWlnaHQsIGZvcm1hdCwgdHlwZSwgcGl4ZWxzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihuZXcgRXJyb3IoXCJnbC50ZXhJbWFnZTJEOiBpbnZhbGlkIGFyZ3VtZW50IGNvdW50IVwiKS5zdGFjayk7XG4gICAgfVxuICB9O1xufVxuXG59LHt9XSwyMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfSwgX3R5cGVvZihvYmopOyB9XG5cbnZhciBfZGVmYXVsdCA9IHtcbiAgZXhwb3J0VG86IGZ1bmN0aW9uIGV4cG9ydFRvKG5hbWUsIGZyb20sIHRvLCBlcnJDYWxsYmFjaywgc3VjY2Vzc0NhbGxiYWNrKSB7XG4gICAgaWYgKF90eXBlb2YoZnJvbSkgIT09IFwib2JqZWN0XCIgfHwgX3R5cGVvZih0bykgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImludmFsaWQgZXhwb3J0VG86IFwiLCBuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZnJvbVByb3BlcnR5ID0gZnJvbVtuYW1lXTtcblxuICAgIGlmICh0eXBlb2YgZnJvbVByb3BlcnR5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGZyb21Qcm9wZXJ0eSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRvW25hbWVdID0gZnJvbVByb3BlcnR5LmJpbmQoZnJvbSk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odG9bbmFtZV0sIGZyb21Qcm9wZXJ0eSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b1tuYW1lXSA9IGZyb21Qcm9wZXJ0eTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdG9bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobmFtZSArIFwiIGlzIG5vdCBzdXBwb3J0IVwiKTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfTtcblxuICAgICAgaWYgKHR5cGVvZiBlcnJDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGVyckNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7fV19LHt9LFsxMF0pO1xuIl0sImZpbGUiOiJyYWwuanMifQ==
