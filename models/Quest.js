

var _ = require('underscore');
module.exports = function(mongoose) {
	
	
	var QuestSchema = new mongoose.Schema({
		title: { type:String } ,
		accountId: {type:mongoose.Schema.ObjectId},
		date_created:{type:Date, 'default':Date.now},
		is_published:{type:Boolean, 'default': false, index:true},
		description:{type:String, 'default':''},
		starting_location: {
			lat: {type: Number, 'default':0},
			lng: {type:Number,'default':0},
			street: {type:String,'default':''},
			radius: {type:Number,'default':10}
		},
		allowed_hints: { type:Number },
		allowed_public_questions: {type:Number, 'default':0},
		allowed_location_finders: {type:Number, 'default':0},
		tags:[{type:String,index:true}],
		images:[{type:String}],
		rating:{type:Number, 'default':1},
		games_played: {type:Number, 'default':10}
	});
	
	QuestSchema.path('tags').set(
	function(tag_arr) {
		var tag_uniq = _.uniq(tag_arr);
		return tag_uniq;
	});
	
	var Quest = mongoose.model('Quest',QuestSchema);

	var create_new = function(data,success_callback,error_callback) {
		var new_quest = new Quest(data);
		new_quest.save(function(err) { if ( err) error_callback(err); else { success_callback(new_quest) }});
	};
	
	var quests_by_account = function(accountId,success_callback,error_callback) {
		Quest.find({accountId:accountId},function(err,doc) {
			if (err) {
				error_callback(err);
			}else { 
				success_callback(doc);
			}
		});
	};
	
	var validate_quest_to_account = function(accountId,quest_id,success_callback,error_callback) {
		Quest.findOne({accountId:accountId, _id:quest_id},function(err,doc) {
			if (err) {
				error_callback(err);
			}else { success_callback(doc) }
		});
	}
	
	var remove_quest = function(q_id,account_id,success_callback,error_callback) {
		Quest.remove({accountId:account_id, _id: q_id},function(err){
			if ( err ){
				error_callback(err);
			}else{
				success_callback();
			}
		});
	}
	
	return {
		Quest: Quest,
		create_new: create_new,
		quests_by_account: quests_by_account,
		Schema: QuestSchema,
		validate_quest_to_account:validate_quest_to_account,
		remove_quest:remove_quest
	};

}