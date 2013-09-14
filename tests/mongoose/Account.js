var mongoose = require('mongoose');
var models = require('../../models/models')(mongoose);
var fakery = require('mongoose-fakery');
before(function (done) {
	mongoose.connect('mongodb://localhost/quesity-test', function(err) { if (err) { console.log(err); } else { done(); } } );    
});

after(function(done) {
	mongoose.disconnect(function() {done();})
});

var create_new_user = function(done,user) {
	var email = Math.random().toString(36).substring(2,5) + "@test.com";
    models.Account.register({
		email:email,
		password:'password',
		first_name: "test", 
		last_name:"test"
},{
	success: function(doc){
		user.me = doc;
	    done();
	},
	error: function(err){
		throw new Error(err);
	}
  
});
}
describe("Account",function() { 
	
	var current_user = {};
	
	
before(function(done){
	create_new_user(done,current_user);
});

after( function(done) { 
	models.Account.Account.remove({}, function(){
	    done();
	  });
});

it("Find by Id" , function(done) {
	models.Account.byId(current_user.me._id,function(doc) {
		doc.email.substring(3,doc.email.length).should.eql("@test.com");
		done();
	})
});

it ( "Successful login", function(done){
	models.Account.login(current_user.me.email, "password", 
			{
				success: function(doc) {
					doc.email.should.eql(current_user.me.email);
					done();
				},
				error: function(err){
					throw new Error(err);
				}
				
			}
	);
});

it("Unsuccessful login" , function(done) {
	models.Account.login("test_account@test.com", "dfsff", 
			{
				success: function(doc) {
					throw new Error("Unsuccessful login succeeded");
				},
				error: function(err){
					done();
				}
				
			}
	);
});

describe("Account & Quests",function() {
	var user_2 = {};
	var user_1 = {};
	var test_quest = {};
	before(function(done) {
		create_new_user(done,user_2);
	});
	before(function(done) { 
		create_new_user(done,user_1);
	});
		
	before(function(done) { 
			models.Quest.create_new({title:"Dummy Quest",accountId:user_2.me._id}, function(doc) {
				doc.title.should.eql("Dummy Quest");
				test_quest = doc;
				done();
			}, function(err){ throw new Error(err); })
	});
	after(function(done) {
			models.Account.Account.remove({}, function(){
			    done();
			});
	});
	after(function(done) { 
		models.Quest.Quest.remove({}, function(){
		    done();
		});
	});
	
	it("Adding quest to user", function(done) {
		models.Account.add_playing_quest({account_id: user_1.me._id+'', quest_id: test_quest._id},
			{
				success:function(doc) {
					doc.quests_playing.length.should.eql(1);
					done();
				},
				error:function(err){
					console.log(err);
					throw new Error(err);
				}
			}	
		);
	});
	
	it("Making sure we can't add the same quest twice .. ", function(done) {
		models.Account.add_playing_quest({account_id: user_1.me._id+'', quest_id: test_quest._id},
				{
					success:function(doc) {
						doc.quests_playing.length.should.eql(1);
						done();
					},
					error:function(err){
						throw new Error(err);
					}
				}	
			);
	});
	
	it("Trying to get the playing quests ... ", function(done) {
		models.Account.get_quests_playing({account_id: user_1.me._id}, {
			success: function(doc) {
				doc.length.should.eql(1);
				doc[0].title.should.eql("Dummy Quest");
				done();
			},
			error: function(err){
				throw new Error(err);
			}
		})
	});
	
	
});

});



