

//Quest.js
module.exports = function(mongoose) {

	var QuestPageSchema = new mongoose.Schema({
		x:{type:Number},
		y:{type:Number},
		page_name:{type:String},
		page_type: {type:String},
		page_number: {type:Number},
		page_content:{type:String},
		links:[Link]
	});
	
	var LinkSchema = new mongoose.Schema({
		links_to_page: {type:String},
		parent_page: {type:String},
		link_type: {type:String}
	});
	
	var LinkAnswerSchema = new LinkSchema.extend({
		answer_txt: {type:String}
	});
	
	var LinkLocationSchema = new LinkSchema.extend({
		lat:{type:Number},
		lng:{type:Number},
		txt_street: {type:String},
		radius:{type:Number} //in meters
	});
	
	var QuestPageStallSchema = QuestPage.extend({
		stall_time:{type:Number}
	});
	var QuestPage = mongoose.model('QuestPage',QuestPageSchema);
	var QuestPageStall = mongoose.model('QuestPageStall',QuestPageStallSchema);
	var Link = mongoose.model('Link',LinkSchema);
	var LinkAnswer = mongoose.model('LinkAnswer',LinkAnswerSchema);
	var LinkLocation = mongoose.model('LinkLocation',LinkLocationSchema);
	
	return {
		QuestPage: QuestPage,
		QuestPageStall: QuestPageStall,
		Link: Link,
		LinkAnswer: LinkAnswer,
		LinkLocation: LinkLocation
	};

}