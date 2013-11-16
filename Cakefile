childProcess = require 'child_process'

build = (watch, cb) ->
	run 'node', ['node_modules/coffee-script/bin/coffee', (if watch then '-cw' else '-c'), '.'], cb

run = (exec, args, cb) ->
	proc = childProcess.spawn exec, args
	proc.stderr.on 'data', (buffer) -> console.log buffer.toString()
	proc.on 'exit', (status) ->
		process.exit(1) if status != 0
		cb() if typeof cb is 'function'

task 'build', 'build everything', -> build false
task 'build:watch', 'keep everything built', -> build true

# These only work on linux (maybe OSX as well)
task 'npm:install', 'install all the packages', -> run 'node', ['/usr/local/bin/npm', 'install']
task 'npm:install:watch', 'install all the packages', -> run 'node', ['node_modules/nodemon/nodemon.js', '-e', 'json', '/usr/local/bin/npm', 'install']