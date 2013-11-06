module.exports = function() {

var request = require('superagent');
var base_url = "http://localhost:5000"


var general_request = function(path,method,res_handler,data,cookies) {
	
	var url = base_url+path;
	var temp_req = {};
	if ( method == 'get' ){
		temp_req = request.get(url);
	}else if ( method == 'post' ) {
		temp_req = request.post(url);
	}else if ( method == 'put' ) {
		temp_req = request.put(url);
	}
	if ( cookies ) {
		temp_req=temp_req.set('Cookie',cookies);
	}
	temp_req.redirects(0).send(data).end(function(res) {
		   res_handler(res);
	});
};
	
	return general_request;
}