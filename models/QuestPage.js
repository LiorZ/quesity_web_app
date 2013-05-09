

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
		radius:{type:Number, set:Math.round} //in meters
		
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
	var Hint = mongoose.model('hint',HintSchema);
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
			'static':QuestPage,
			'open_question': QuestPage
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
	var new_array_item = function(data,callbacks,type,array_key,item_key) {
		QuestPage.findOne({quest_id:data.quest_id, _id:data.page_id},function(err,doc){
			if ( err ) {
				callbacks.error(err);
			}else {
				var item = new type(data[item_key]); 
				doc[array_key].push(item);
				doc.save(function(err) {
					if (err) {
						callbacks.error(err);
					}else{
						callbacks.success(item);
					}
				})
			}
		});
	}
	var new_link = function(data,callbacks) {
		new_array_item(data,callbacks,Link,'links','link');
	}
	
	var find_item_in_array_doc = function(doc,item_id,array_key) {
		var item = undefined;
		_.each(doc[array_key],function(some_item) {
			if ( some_item._id.equals(item_id) ){
				item=some_item;
			}
		});
		return item;
	}
	
	var update_array_item = function(data,callbacks,array_key,item_key) {
		QuestPage.findOne({quest_id:data.quest_id, _id:data.page_id},function(err,doc) {
			if ( err ) {
				callbacks.error(err);
			}else {
				var item = find_item_in_array_doc(doc,data[item_key]._id,array_key);
				if (_.isNull(item) || _.isUndefined(item) ) {
					callbacks.error("Can't locate " + item_key);
					return;
				}
				for(var propt in data[item_key]){
				    item[propt] = data[item_key][propt];
				}
				
				doc.save(function(err) {
					if (err) {
						callbacks.error(err);
					}else{
						callbacks.success(item);
					}
				})
				
			}
		});
	};
	
	var update_link = function(data,callbacks) {
		update_array_item(data,callbacks,'links','link');
	};
	
	var delete_array_item = function(data,callbacks,array_key,item_key) {
		QuestPage.findOne({quest_id:data.quest_id, _id:data.page_id},function(err,doc) {
			if ( err ) {
				callbacks.error(err);
			}else {
				var item = find_item_in_array_doc(doc,data[item_key]._id,array_key);
				if (_.isNull(item) || _.isUndefined(item) ) {
					callbacks.error("Can't locate link");
					return;
				}
				doc[array_key].remove(item);
				doc.save(function(err) {
					if (err) {
						callbacks.error(err);
					}else{
						callbacks.success();
					}
				});
			}
		});
	}
	
	var delete_link = function(data,callbacks) {
		delete_array_item(data,callbacks,'links','link');
	}
	
	var new_hint = function(data,callbacks){
		new_array_item(data,callbacks,Hint,'hints','hint');
	}
	var update_hint = function(data,callbacks) {
		update_array_item(data,callbacks,'hints','hint');
	}
	
	var delete_hint = function(data,callbacks) {
		delete_array_item(data,callbacks,'hints','hint');
	}
	return {
		QuestPage: QuestPage,
		QuestPageStall: QuestPageStall,
		Link: Link,
		pages_by_quest_id:pages_by_quest_id,
		new_page: new_page,
		update_page: update_page,
		remove_page:remove_page,
		new_link:new_link,
		delete_link:delete_link,
		update_link:update_link,
		new_hint:new_hint,
		update_hint:update_hint,
		delete_hint:delete_hint
	};

}