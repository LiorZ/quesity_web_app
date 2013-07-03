var mocha = require('mocha');
var should = require('should')
var mongoose = require('mongoose');
var models = {};
models.Quest = require('../Quest')(mongoose);
models.Account = require('../Account')(mongoose,models.Quest);
var _ = require('underscore');
var extend = require('mongoose-schema-extend');

models.QuestPage = require('../QuestPage')(mongoose,extend,_);
models.Event = require('../Event')(mongoose,models.Quest,models.Account);
// We need a database connection
mongoose.connect('mongodb://localhost/quesity-test');


var quest_id;
var account_id;
var event_id;
describe('Testing Event module', function() {
		it('Finding the test account ... ', function( done ) { // Async test, the lone argument is the complete callback
		     models.Account.Account.findOne({email:'test@test'},function(err,doc){
		    	 if (err) {
		    		 done(err);
		    	 }else {
		    		 doc.email.should.be.equal("test@test");
		    		 account_id = doc._id
		    		 done();
		    	 }
		     })
		});
	
		
	it('Creating test quest' , function(done){
		models.Quest.create_new({title:'quest',accountId: account_id},
				function(doc){
					doc.title.should.be.equal('quest');
					quest_id = doc.quest_id;
					done();
				},
				function(err){
					done(err);
				}
		)
	});
	it('Creating new event ... ', function( done ) {
		models.Event.create_new({
			title: 'some_event',
			creator_id: account_id,
			date_created:new Date('21/3/2013'),
			due:new Date('22/3/2013'),
			quest_id: quest_id
		}, 
		{
			error: function(err){
				done(err);
			},
			success: function(doc){
				doc.title.should.be.equal('some_event');
				doc.participants.length.should.be.equal(1);
				event_id = doc._id;
				done();
			}
		}
		);
	});
	
	it ('Adding new participant to the event', function(done) {
		models.Account.Account.findOne({email:'l@l'}, 
		function(err,user){
				models.Event.add_participant({participant_id:user._id,event_id:event_id}, {
					success:function(event) {
						event.participants.length.should.be.equal(2);
						done();
					},
					error:function(err){
						done(err);
					}
				})
		});
	});
	
	it('Finding all events ... ' , function(done) {
		models.Event.all_events({
			success: function(events){
				events.length.should.be.greaterThan(1);
				done();
			},
			error: function(err){
				done(err);
			}
		})
	});
	
	it('Finding events per account', function(done) {
		models.Event.events_for_account({account_id:account_id}, {
			success:function(events) {
				events.length.should.be.greaterThan(1);
				done();
			},
			error: function(err) {
				done(err);
			}
		})
	})
});
