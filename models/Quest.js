

var _ = require('underscore');
module.exports = function(mongoose) {
	
	
	var ReviewSchema = new mongoose.Schema({
		account_id: {type: mongoose.Schema.ObjectId, ref:'Account', index:true},
		date_created: {type:Date, 'default':Date.now},
		review_text: {type:String, 'default':''},
		rating: {type: Number,'default':0},
		game_id: {type: mongoose.Schema.ObjectId, ref:'Game', index:true}
	});
	
	var Review = mongoose.model('Review',ReviewSchema);
	
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
		games_played: {type:Number, 'default':10},
		distance:{type:Number, 'default':3},
		time:{type:Number, 'default':60},
		map_url:{type:String,'default':""},
		reviews: [ReviewSchema],
		access_restriction:{ type:String, enum:{
				values:["code","in_app","free"],
				message:"Wrong entry for access_restriction"
			}
		}
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
	
	var submit_review = function(q_id, review_json,success_callback, error_callback) {
		Quest.findOne({_id:q_id}, function(err,quest) {
			if ( err ) {
				error_callback(err);
			}else{
				var review = new Review(review_json);
				quest.reviews.push(review_json);
				quest.save(function(err){
					if ( err ) {
						error_callback(err);
					}else{
						success_callback(review);
					}
				});
			}
		})
	}
	
	return {
		Quest: Quest,
		create_new: create_new,
		quests_by_account: quests_by_account,
		Schema: QuestSchema,
		validate_quest_to_account:validate_quest_to_account,
		remove_quest:remove_quest,
		submit_review: submit_review
	};

}