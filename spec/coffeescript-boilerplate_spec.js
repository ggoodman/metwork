;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  describe('yap', function() {
    var yap;

    yap = require('../tmp/yap');
    return it('should politely greet visitors', function() {
      return expect(yap.greet()).toEqual('Hello World ☕');
    });
  });

}).call(this);

},{"../tmp/yap":2}],2:[function(require,module,exports){
(function() {
  exports.greet = function() {
    return 'Hello World ☕';
  };

}).call(this);

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZmVsaXgvV29ya3NwYWNlL2NvZmZlZXNjcmlwdC1ib2lsZXJwbGF0ZS9zcGVjL2NvZmZlZXNjcmlwdC1ib2lsZXJwbGF0ZV9zcGVjLmpzIiwiL1VzZXJzL2ZlbGl4L1dvcmtzcGFjZS9jb2ZmZWVzY3JpcHQtYm9pbGVycGxhdGUvdG1wL3lhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgneWFwJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHlhcDtcblxuICAgIHlhcCA9IHJlcXVpcmUoJy4uL3RtcC95YXAnKTtcbiAgICByZXR1cm4gaXQoJ3Nob3VsZCBwb2xpdGVseSBncmVldCB2aXNpdG9ycycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cGVjdCh5YXAuZ3JlZXQoKSkudG9FcXVhbCgnSGVsbG8gV29ybGQg4piVJyk7XG4gICAgfSk7XG4gIH0pO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICBleHBvcnRzLmdyZWV0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdIZWxsbyBXb3JsZCDimJUnO1xuICB9O1xuXG59KS5jYWxsKHRoaXMpO1xuIl19
;