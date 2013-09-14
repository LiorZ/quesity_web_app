var mongoose = require('mongoose');
var models = require('../../models/models')(mongoose);
var fixtures = require('pow-mongoose-fixtures');
var account_id='', quest_id = '';
var db = {};
before(function(done) {
	db = mongoose.createConnection('mongodb://localhost/quesity-test', function(err) { if (err) { console.log(err); } else { done(); } } );
});
before(function (done) {
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

//find account id :

before(function(done) {
	models.Account.Account.findOne({email:'test2@test.com'},function(err,doc) {
		if ( err ) {
			done(err);
		}else { 
			account_id = doc._id;
			done();
		}
	})
});

before(function(done) {
	models.Quest.Quest.findOne({title:'Quest_1'},function(err,doc){
		if ( err ) {
			done(err);
		}else {
			quest_id = doc._id;
			done();
		}
	});
});
after(function(done) {
	mongoose.disconnect(function() {done();})
});


describe("Testing the Game module", function() {
	it("Testing adding a new game" ,function(done) {
		var callbacks = {
				error: function(err){
					done(err);
				},
				success: function(game) {
					game.quest.should.eql(quest_id);
					game.is_over.should.eql(false);
					done();
				}
		}
		models.Game.new_game({quest_id:quest_id, account_id:account_id}, callbacks);
	});
	
	
});

