

//QuestPage.js
module.exports = function(mongoose,extend) {

	
	var LinkSchema = new mongoose.Schema({
		links_to_page: {type:String},
		parent_page: {type:String},
		link_type: {type:String}
	});
	
	var QuestPageSchema = new mongoose.Schema({
		x:{type:Number},
		y:{type:Number},
		page_name:{type:String},
		page_type: {type:String},
		page_number: {type:Number},
		page_content:{type:String},
		links:[LinkSchema],
		quest_id: {type:String}
	});
	

	
	var LinkAnswerSchema = LinkSchema.extend({
		answer_txt: {type:String}
	});
	
	var LinkLocationSchema = LinkSchema.extend({
		lat:{type:Number},
		lng:{type:Number},
		txt_street: {type:String},
		radius:{type:Number} //in meters
	});
	
	var QuestPageStallSchema = QuestPageSchema.extend({
		stall_time:{type:Number}
	});
	
	var QuestPage = mongoose.model('QuestPage',QuestPageSchema);
	var QuestPageStall = mongoose.model('QuestPageStall',QuestPageStallSchema);
	var Link = mongoose.model('Link',LinkSchema);
	var LinkAnswer = mongoose.model('LinkAnswer',LinkAnswerSchema);
	var LinkLocation = mongoose.model('LinkLocation',LinkLocationSchema);
	
	
	var pages_by_quest_id = function(q_id, success_callback,error_callback){
		QuestPage.find({quest_id:q_id},function(err,doc) {
			if ( err ) { 
				error_callback(err);
			}else{
				success_callback(doc);
			}
		});
	};
	update_page = function(q_id,new_page,success_callback,error_callback){
		QuestPage.findOne({quest_id:q_id,_id:new_page._id},function(err,doc) {
			if (err){
				error_callback(err);
			}else {
				console.log("DOC: " + doc);
				if ( doc == null ){
					error_callback("Can't find page .. ");
					return;
				}
				for(var propt in new_page){
				    doc[propt] = new_page[propt];
				}
				doc.save(function(err) {
					if ( err ) {
						error_callback(err);
					}else {
						success_callback(doc);
					}
				});
			}
		})
	}
	
	var new_page = function(data,success_callback,error_callback) {
		var page = new QuestPage(data);
		page.save(function(err){
			if ( err ) {
				error_callback(err);
			}else { 
				success_callback(page);
			}
		});
	}
	return {
		QuestPage: QuestPage,
		QuestPageStall: QuestPageStall,
		Link: Link,
		LinkAnswer: LinkAnswer,
		LinkLocation: LinkLocation,
		pages_by_quest_id:pages_by_quest_id,
		new_page: new_page,
		update_page: update_page
	};

}