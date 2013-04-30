

//QuestPage.js
module.exports = function(mongoose,extend,_) {

	
	var LinkSchema = new mongoose.Schema({
		links_to_page: {type:String},
		parent_page: {type:String},
		type: {type:String},
		answer_txt:{type:String},
		lat:{type:Number},
		lng:{type:Number},
		txt_street: {type:String},
		radius:{type:Number} //in meters
		
	},{ collection : 'links', discriminatorKey : 'type' });
	
	var HintSchema = new mongoose.Schema({
		hint_title:{type: String, unique:false},
		hint_txt: {type:String, unique:false}
	});
	
	var QuestPageSchema = new mongoose.Schema({
		x:{type:Number},
		y:{type:Number},
		page_name:{type:String},
		page_type: {type:String},
		page_number: {type:Number},
		page_content:{type:String},
		links:[LinkSchema],
		hints:[HintSchema],
		quest_id: {type:String, index:true}
	},{ collection : 'pages', discriminatorKey : 'page_type' });
	
//Can't allow schema inheritance, so this is useless for now...
//	var LinkAnswerSchema = LinkSchema.extend({
//		answer_txt: {type:String}
//	});
//	
//	var LinkLocationSchema = LinkSchema.extend({
//		lat:{type:Number},
//		lng:{type:Number},
//		txt_street: {type:String},
//		radius:{type:Number} //in meters
//	});
	
	var QuestPageStallSchema = QuestPageSchema.extend({
		stall_time:{type:Number}
	});
	
	var QuestPage = mongoose.model('QuestPage',QuestPageSchema);
	var QuestPageStall = mongoose.model('stall',QuestPageStallSchema);
	var Link = mongoose.model('regular',LinkSchema);
//	var LinkAnswer = mongoose.model('answer',LinkAnswerSchema);
//	var LinkLocation = mongoose.model('location',LinkLocationSchema);
//	var LinkMap = {
//			'answer':LinkAnswer,
//			'location':LinkLocation
//	};
	
	
	var SchemaRouter = {
			'stall':QuestPageStall,
			'location':QuestPage,
			'question':QuestPage,
			'surprise':QuestPage,
			'static':QuestPage
	}
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
				console.log("new_page ");
				console.log(new_page);
				console.log("DOC: " + doc);
				if ( doc == null ){
					error_callback("Can't find page .. ");
					return;
				}
				//Setting up links: 
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
		var page = new SchemaRouter[data.page_type](data);
		page.save(function(err){
			if ( err ) {
				error_callback(err);
			}else { 
				success_callback(page);
			}
		});
	}
	
	var remove_page = function(data,success_callback,error_callback){
		QuestPage.remove({_id:data.page_id, quest_id: data.quest_id}, function(err){
			if (err) {
				error_callback(err);
			}else {
				success_callback();
			}
		});
	}
	return {
		QuestPage: QuestPage,
		QuestPageStall: QuestPageStall,
		Link: Link,
		pages_by_quest_id:pages_by_quest_id,
		new_page: new_page,
		update_page: update_page,
		remove_page:remove_page
	};

}