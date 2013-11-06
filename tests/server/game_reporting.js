var request_handler = require('./request_handler')();
var should = require('should');
var FaceTest = require('facetest');
var mongoose = require('mongoose');
var models = require('../../models/models')(mongoose);
var _ = require('underscore');
var graph = require('fbgraph')


var fixtures = require('pow-mongoose-fixtures');
var login_cookie = {};
var test_data = {}
before(function(done){
	db = mongoose.connect('mongodb://localhost/quesity-test', function(err) { if (err) { console.log(err); } else { done(); } } );
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

describe("Testing game reporting" , function() {
	it("Logging in",function(done) {
		request_handler('/login/local','post',function(res){
			res.status.should.eql(302);
	    	login_cookie = res.headers['set-cookie'][0];
	    	done();
		},{email:'test1d@test.com',password:'abcd'})
	});
    
	it("Fetching all quests", function(done) {
    	request_handler('/all_quests','get',function(res) {
    		res.status.should.eql(200);
    		res.body.length.should.be.above(0);
    		var quest = res.body[0];
    		quest.title.should.eql("Quest_1");
    		quest.is_published.should.eql(true);
    		test_data.quest = quest;
    		quest.accountId.should.not.eql(undefined)
    		done();
    });
	});
    it("Fetching quest pages", function(done) {
    	request_handler('/quest/' + test_data.quest._id + '/pages','get',function(res) {
    		res.status.should.eql(200);
    		res.body.length.should.be.above(5);
    		test_data.quest.pages = res.body;
    		done();
    	},{},login_cookie);
    });
    
    it("Start a new game" , function(done) {
    	request_handler('/quest/' +  test_data.quest._id + '/game/new', 'post', function(res) {
    		res.status.should.eql(200);
    		var game = res.body;
    		game.quest_id.should.eql(test_data.quest._id);
    		test_data.game = game;
    		done();
    	},{},login_cookie);
    });
    
    it("Report a new location", function(done) {
    	var request_str = '/quest/' + test_data.quest._id + '/game/'+test_data.game._id+'/location/new'; 
    	request_handler(request_str,'post',
    	function(res) {
    		res.status.should.eql(200);
    		done();
    	},{ lat:32.2222, lng:33.1111, date:new Date()
    	},login_cookie)
    });
    
    it("Report several locations", function(done) {
    	var request_str = '/quest/' + test_data.quest._id + '/game/'+test_data.game._id+'/location/new';
    	var locations = [
    	                 {
    	                	 lat:32.11,lng:22.11,date:new Date()
    	                 },
    	                 {
    	                	 lat:32.12,lng:22.12, date:new Date()
    	                 }
    	];
    	request_handler(request_str,'post',function(res){
    		res.status.should.eql(200);
    		res.body.locations.length.should.eql(3);
    		done();
    	},locations,login_cookie);
    })
    
    it("Report solving first page",function(done) {
    	var request_str = '/quest/' + test_data.quest._id + '/game/'+test_data.game._id+'/move/new';
    	var first_page = _.findWhere(test_data.quest.pages,{is_first:true});
    	first_page.should.not.eql(undefined);
    	first_page.page_number.should.eql(1);
    	first_page.links.length.should.eql(1);
    	
    	var link = first_page.links[0];
    	var move = {
    		date: new Date(),
    		link_id: link._id,
    		location: {
    			lat:32.22, lng:33.11, date: new Date()
    		}
    	}
    	
    	request_handler(request_str,'post',function(res) {
    		res.status.should.eql(200);
    		var game = res.body;
    		game.moves.length.should.eql(1);
    		done();
    	},move,login_cookie);
    	
    });
    
    it("Report solving several pages", function(done) {
    	var request_str = '/quest/' + test_data.quest._id + '/game/'+test_data.game._id+'/move/new';
    	var second_page = _.findWhere(test_data.quest.pages,{page_number:2});
    	second_page.should.not.eql(undefined);
    	var third_page = _.findWhere(test_data.quest.pages,{page_number:3});
    	third_page.should.not.eql(undefined);
    	var link_2_3  = _.findWhere(second_page.links,{links_to_page:third_page._id});
    	
    	link_2_3.should.not.eql(undefined);
    	
    	var moves = [
    	             {
    	            	 date: new Date(),
    	            	 link_id: link_2_3._id,
    	            	 location: {
    	            		 lat:32.223, lng:33.112, date:new Date()
    	            	 }
    	             },
    	             {
    	            	 date: new Date(),
    	            	 link_id: third_page.links[0]._id,
    	            	 location: {
    	            		 lat: 32.224,lng:33.113, date:new Date()
    	            	 }
    	             }
    	];
    	
    	request_handler(request_str,'post',function(res) {
    		res.status.should.eql(200);
    		var game = res.body;
    		game.moves.length.should.eql(3);
    		done();
    	},moves,login_cookie);
    	
    })
    	
    	
 });
	    
	
	
	
