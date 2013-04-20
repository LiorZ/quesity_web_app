

//Quest.js
module.exports = function(mongoose) {

	var QuestSchema = new mongoose.Schema({
		title: { type:String } ,
		accountId: {type:mongoose.Schema.ObjectId},
		date_created:{type:Date, 'default':Date.now},
	});
	
	var Quest = mongoose.model('Quest',QuestSchema);
	
	var create_new = function(data,success_callback,error_callback) {
		var new_quest = new Quest({title:data.title,accountId:data.accountId});
		new_quest.save(function(err) { if ( err) error_callback(err); else { success_callback(new_quest) }});
	};
	
	quests_by_account = function(accountId,success_callback,error_callback) {
		Quest.find({accountId:accountId},function(err,doc) {
			if (err) {
				error_callback(err);
			}else { 
				success_callback(doc);
			}
		});
	};
	
	validate_quest_to_account = function(accountId,quest_id,success_callback,error_callback) {
		Quest.findOne({accountId:accountId, _id:quest_id},function(err,doc) {
			if (err) {
				error_callback(err);
			}else { success_callback(doc) }
		});
	}
	
	return {
		Quest: Quest,
		create_new: create_new,
		quests_by_account: quests_by_account,
		Schema: QuestSchema,
		validate_quest_to_account:validate_quest_to_account
	};

}