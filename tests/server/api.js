//var request = require('superagent');
//var mongoose = require('mongoose');
//var models = require('../../models/models')(mongoose);
//var url = "http://localhost:5000";
//var fixtures = require('pow-mongoose-fixtures');
//var async = require('async');
//var should = require('should');
//
//var general_request = function(url,method,res_handler,data,cookies) {
//	var temp_req = {};
//	if ( method == 'get' ){
//		temp_req = request.get(url);
//	}else if ( method == 'post' ) {
//		temp_req = request.post(url);
//	}else if ( method == 'put' ) {
//		temp_req = request.put(url);
//	}
////	if ( cookies ) {
//		temp_req=temp_req.set('Cookie',cookies);
//	}
//	temp_req.send(data).end(function(res) {
//			
//		   res_handler(res);
//	});
//}
//
//var login_func = function(res_handler,data){
//	general_request(url+'/login','post',res_handler,data);
//}
//
//var logoff_func = function(res_handler,data,login_cookie){
//	general_request(url+'/logoff','get',res_handler,data,login_cookie);
//}
//
//var registration_func = function(res_handler,data) {
//	general_request(url+'/register','post',res_handler,data);
//}
//
//var quest_creation_func = function(res_handler,data,cookie) {
//	general_request(url+'/new_quest','post',res_handler,data,cookie);
//}
//
//var quest_update_func = function(res_handler,data,cookie) {
//	general_request(url+'/quest/'+data._id,'put',res_handler,data,cookie);
//}
//
//var fetch_quest_func = function(res_handler,quest_id,cookie) {
//	general_request(url+'/quest/'+quest_id,'get',res_handler,{},cookie);
//}
//
//var page_creation_func = function(res_handler,data,cookie){
//	general_request(url+'/quest/'+data.quest_id+'/new_page','post',res_handler,data,cookie);
//}
//
//var page_fetch_func = function(res_handler,data,cookie){
//	general_request(url+'/app/'+data.quest_id+'/page/'+data.page_id,'get',res_handler,data,cookie);
//}
//
//describe("Running API Server Tests" , function() {
//	var db = {};
//	var login_cookie = '';
//	before(function(done){
//		 db = mongoose.connect('mongodb://localhost/quesity-test', function(err) { if (err) { console.log(err); } else { done(); } } );
//	});
//	before(function(done) {
//			fixtures.load('../fixtures/',db, function(err) {
//				if (!err) {
//					done();
//				}
//				else{
//					console.log("ERROR");
//					done(err);
//				}
//			});
//	});
//	describe("Login functionality" , function() {
//		it("Regular login", function(done) {
//			var res_handler = function(res) {
//				   res.ok.should.eql(true);
//				   
//				   var account = res.body;
//				   account.should.not.have.property('password');
//				   account.activated.should.eql(true);
//				   login_cookie = res.header['set-cookie'][0];
//				   done();
//			}
//			login_func(res_handler,{email:'test1d@test.com', password:'abcd'});		
//	
//		});
//		
////		it("Testing wrong login", function(done) {
////			var res_handler = function(res){
////				res.ok.should.not.eql(true);
////				done();
////			}
////			login_func(res_handler,{email:"SDFSD@SS.com",password:'sss'});
////		});
////		
////		it("Testing login with undefined password", function(done) {
////			var res_handler = function(res){
////				res.ok.should.not.eql(true);
////				done();
////			};
////	
////			login_func(res_handler,{email:"SDF@SSS.com"});
////		});
////		
////		it("Testing login with undefined data", function(done) { 
////			var res_handler =function(res) {
////				res.ok.should.not.eql(true);
////				done();
////			}
////			login_func(res_handler,{});
////		});
//	});
//	
////	describe("Registration functionality" , function() {
////		it("Regular registration", function(done) {
////			var data = {
////					firstName: "Koko",
////					lastName:"Loco",
////					email:"koko@loco.com",
////					password: '1234'
////				};
////			
////			var res_handler = function(res){
////				res.ok.should.eql(true);
////				done();
////			}
////			registration_func(res_handler,data);
////		});
////		
////		it("Login with newly created user", function(done) {
////			var data = {email:'koko@loco.com', password:'1234'};
////			var res_handler = function(res) {
////				res.ok.should.eql(true);
////				done();
////			}
////			login_func(res_handler,data);
////		});
////		
////		it("Trying to register another user with same email" , function(done) {
////			var data = {
////					firstName: "Momo",
////					lastName:"Lolo",
////					email:"koko@loco.com",
////					password: '1234'
////				};
////			
////			var res_handler = function(res){
////				res.ok.should.eql(false);
////				done();
////			}
////			registration_func(res_handler,data);
////		});
////		
////		it("Trying to register with an empty request" , function(done) {
////			var data = {}
////			var res_handler = function(res) {
////				res.ok.should.eql(false);
////				done();
////			}
////			registration_func(res_handler,data);
////		});
////	});
//	
//describe("Testing quest related functionality", function() {
//		var quest_id = '';
//		it("Quest creation",function(done) {
//			var data = {
//					title:"Test Quest no. 1"
//			};
//			var res_handler = function(res) {
//				res.ok.should.eql(true);
//				quest_id = res.body._id;
//				quest_id.length.should.eql(24);
//				done();
//			}
//			
//			quest_creation_func(res_handler,data,login_cookie);
//		});
////		
////		it("Fetching a quest by id", function(done) {
////			var res_handler = function(res){
////				res.ok.should.eql(true);
////				var quest_json = res.body;
////				quest_json.title.should.eql("Test Quest no. 1");
////				done();
////			}
////			
////			fetch_quest_func(res_handler,quest_id,login_cookie);
////		});
////		
////		
////		it("Update quest settings" , function(done) {
//////			quest_update_func = function(res,handler,data,cookie)
////			var res_handler = function(res) {
////				var new_quest = res.body;
////				res.ok.should.eql(true);
////				console.log(new_quest);
////				new_quest.tags.length.should.eql(3);
////				done();
////			}
////			var json = {
////					title:"Quest title",
////					_id: quest_id,
////					date_created: new Date(),
////					description:"Just a description",
////					starting_location:{ 
////						lat:32.1,
////						lng:32.1,
////						street:"Sichanit 3, Kiryat Ekron, Israel",
////					},
////					allowed_hints: { type:Number },
////					tags:["Tel Aviv","Koko","Loco","Tel Aviv"]
////			};
////			quest_update_func(res_handler,json,login_cookie);
////		});
////		
////		
////		describe("Testing Quest Pages functionality", function() {
////
////			var get_a_dummy_page = function(type,number,q_id) {
////				var page = {
////					x:10,
////					y:10,
////					page_name:"Dummy Page",
////					page_type: type,
////					page_number: number,
////					page_content:"Some content .... bla bla bla",
////					quest_id: q_id
////				};
////				return page;
////			}
////			var static_page = {}
////			
////			it("Create New Static page", function(done) {
////				static_page = get_a_dummy_page('static',1,quest_id);
////				var res_handler = function(res) {
////					res.ok.should.eql(true);
////					res.body._id.length.should.be.above(10);
////					static_page._id = res.body._id;
////					done();	
////				}
////				
////				page_creation_func(res_handler,static_page,login_cookie);
////				
////			});
////			it("Fetch the created page", function(done) {
////				var res_handler = function(res) {
////					res.ok.should.eql(true);
////					res.body._id.should.eql(static_page._id);
////					res.body.page_name.should.eql("Dummy Page");
////					res.body.page_content.should.eql(static_page.page_content);
////					done();
////				}
////				page_fetch_func(res_handler,{quest_id:quest_id, page_id:static_page._id},login_cookie);
////				
////			});
////		});
//});
//	
//describe("Logoff functionality", function() { 
//		
//		it("Logoff with existing user: ", function(done) {
//			var res_handler = function(res) {
//				res.ok.should.eql(true);
//				done();
//			}
//			logoff_func(res_handler,{},login_cookie);
//		});
//});
//});