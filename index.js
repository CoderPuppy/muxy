// Generated by CoffeeScript 1.6.3
(function() {
  var muxDemux, through, timestamp;

  timestamp = require('monotonic-timestamp');

  muxDemux = require('mux-demux');

  through = require('through');

  module.exports = function() {
    var mx, streams;
    mx = muxDemux();
    streams = {};
    mx.on('connection', function(mxStream) {
      var input, stream, _ref;
      mx.open(mxStream.meta, false);
      _ref = streams[mxStream.meta], stream = _ref.stream, input = _ref.input;
      mxStream.pipe(input);
      return stream.resume();
    });
    mx.open = function(name, createMxStream) {
      var int, mxStream, sent;
      if (createMxStream == null) {
        createMxStream = true;
      }
      if (streams[name] != null) {
        return streams[name].stream;
      }
      sent = {};
      int = {
        send: function(data) {
          return int.output.queue(data);
        },
        recv: function(data) {
          return int.stream.queue(data);
        }
      };
      mxStream = null;
      int.stream = through(int.send);
      int.input = through(int.recv);
      int.output = through();
      int.stream.pause();
      if (createMxStream) {
        int.mxStream = mx.createStream(name);
        int.output.pipe(int.mxStream).pipe(int.input);
        int.stream.resume();
      }
      streams[name] = int;
      return int.stream;
    };
    return mx;
  };

}).call(this);
