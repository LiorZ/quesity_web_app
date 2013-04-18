

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
		new_quest.save(function(err) { if ( err) error_callback; else { success_callback }});
	};
	
	return {
		Quest: Quest
	};

}