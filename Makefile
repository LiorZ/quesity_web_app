install:
	node_modules/requirejs/bin/r.js -o app.build.js
	cp -rf node_modules dist/.
test-mongoose:
	node_modules/mocha/bin/mocha --require should -R spec models/tests/
	
test-api: 
	node_modules/mocha/bin/mocha --require should -R spec tests/server/