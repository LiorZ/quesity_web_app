install:
	node_modules/requirejs/bin/r.js -o app.build.js
	cp -rf node_modules dist/.
