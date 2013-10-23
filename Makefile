deploy:
	rm -rf dist
	mkdir dist
	r.js -o app.build.js
	rsync -av . dist/. --exclude=dist --exclude=.git --exclude=tests --exclude=node_modules --exclude=public
test-mongoose:
	node_modules/mocha/bin/mocha --require should -R spec tests/mongoose
	
test-api: 
	node app.js --mode test_local &
	sleep 3
	node_modules/mocha/bin/mocha --require should -R spec tests/server/
	killall node
