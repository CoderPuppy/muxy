timestamp = require 'monotonic-timestamp'
muxDemux  = require 'mux-demux'
through   = require 'through'

module.exports = ->
	mx = muxDemux()

	streams = {}

	mx.on 'connection', (mxStream) ->
		mx.open mxStream.meta, false

		{stream, input} = streams[mxStream.meta]

		mxStream.pipe(input)
		stream.resume()

	mx.open = (name, createMxStream = true) ->
		if streams[name]?
			return streams[name].stream

		sent = {}

		int = {
			send: (data) -> int.output.queue(data)
			recv: (data) -> int.stream.queue(data)
		}

		mxStream = null

		int.stream = through int.send
		int.input = through int.recv
		int.output = through()

		int.stream.pause()

		if createMxStream
			int.mxStream = mx.createStream(name)
			int.output.pipe(int.mxStream).pipe(int.input)
			int.stream.resume()

		streams[name] = int

		int.stream

	mx