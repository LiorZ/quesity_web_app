module.exports = function(mongoose) {
	
	var FeedbackSchema = new mongoose.Schema({
		account_id: {type: mongoose.Schema.ObjectId, ref:'Account', index:true},
		date_created: {type:Date, 'default':Date.now},
		feedback_text: {type:String}
	});
	
	var Feedback = mongoose.model('Feedback',FeedbackSchema);
	
	return Feedback;
}