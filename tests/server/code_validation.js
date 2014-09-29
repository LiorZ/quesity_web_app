var request_handler = require('./request_handler')();
var should = require('should');
var mongoose = require('mongoose');
var models = require('../../models/models')(mongoose);
var _ = require('underscore');


var fixtures = require('pow-mongoose-fixtures');
var login_cookie = {};
var test_data = {}
before(function(done){
	db = mongoose.createConnection('mongodb://localhost/quesity-test', function(err) { if (err) { console.log(err); } else { done(); } } );
});
before(function(done) {
	fixtures.load('../fixtures/',db, function(err) {
		if (!err) {
			done();
		}
		else{
			console.log("ERROR");
			done(err);
		}
	});
});

describe("Testing Code validation" , function() {
	it("Logging in",function(done) {
		request_handler('/app/login/local','post',function(res){
			res.status.should.eql(200);
			test_data.account = res.body;
	    	login_cookie = res.headers['set-cookie'][0];
	    	done();
		},{email:'test1d@test.com',password:'abcd'})
	});
	
	it("Validating Good Code",function(done) {
		request_handler('/app/validate_code','post',function(res) {
			res.status.should.eql(200);
			done();
		},{code:881388},login_cookie);
	});
	
	it("Revalidating used code", function(done) {
		request_handler('/app/validate_code','post',function(res) {
			res.status.should.eql(401);
			done();
		},{code:"881388"},login_cookie);
	});
	
	it("Trying to validate some random code that does not exist" ,function(done) {
		request_handler('/app/validate_code','post',function(res) {
			res.status.should.eql(401);
			done();
		},{code:881},login_cookie);
	});
	it("Trying to validate null code" ,function(done) {
		request_handler('/app/validate_code','post',function(res) {
			res.status.should.eql(401);
			done();
		},{},login_cookie);
	});
});