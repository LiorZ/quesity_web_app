var mongoose = require('mongoose');
var models = require('../../models/models')(mongoose);
before(function (done) {
	mongoose.createConnection('mongodb://localhost/quesity-test', function(err) { if (err) { console.log(err); } else { done(); } } );    
});

after(function(done) {
	mongoose.disconnect(function() {done();})
});

describe("Testing the Quest module", function() {
	it("Creating new quest", function(done) {
//		title: { type:String } ,
//		accountId: {type:mongoose.Schema.ObjectId},
//		date_created:{type:Date, 'default':Date.now},
//		is_published:{type:Boolean, 'default': false},
//		description:{type:String},
//		starting_location: {
//			lat: {type: Number},
//			lng: {type:Number},
//			street: {type:String}
//		},
//		allowed_hints: { type:Number },
//		tags:[{type:mongoose.Schema.ObjectId, ref:'QuestTag', index:true}]
		var quest_json = {
				title:"Quest title",
				description:"Just a description",
				starting_location:{ 
					lat:32.1,
					lng:32.1,
					street:"Sichanit 3, Kiryat Ekron, Israel",
				},
				allowed_hints: { type:Number },
				tags:["Tel Aviv","Koko","Loco","Tel Aviv"]
		}
		
		var new_quest = models.Quest.Quest(quest_json);
		new_quest.save(function(err,doc) {
			if (err) {
				done(err);
			}else{
				doc.tags.length.should.eql(3);
				doc.description.should.equal(quest_json.description);
				done();
			}
		});
	});
});