install:
	r.js -o app.build.js
	rsync -av . dist/. --exclude=dist --exclude=.git --exclude=tests --exclude=node_modules
	rm -rf dist/public
	mv public_deployed dist/public
test-mongoose:
	node_modules/mocha/bin/mocha --require should -R spec models/tests/
	
test-api: 
	node_modules/mocha/bin/mocha --require should -R spec tests/server/