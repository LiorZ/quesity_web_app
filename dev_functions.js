module.exports = function(app,models,auth) {
	app.get('/all_quests', function(req,res,next) {
		console.log("Requesting all quests...");
		models.Quest.Quest.find({},function(err,doc) {
			if (err) {
				res.send(401);
			}else { 
				res.send(doc);
			}
		});
	});
	
	app.get('/app/:q_id/first_page',function(req,res,next) {
		var quest_id = req.param('q_id');
		console.log("Finding first page of " + quest_id);
		models.QuestPage.get_first_page({quest_id:quest_id}, {
			error: function(err){
				console.log(err);
				res.send(401);
			},
			success: function(page){
				res.send(page);
			}
		})
	});
	
	app.get('/app/:q_id/page/:page_id', function(req,res,next) {
		var quest_id = req.param('q_id');
		var page_id = req.param('page_id');
		console.log("Finding page with id " + page_id);
		models.QuestPage.page_by_id({page_id:page_id, quest_id:quest_id},{
			error: function(err){ 
				console.log(err);
				res.send(401);
			},
			success:function(page) {
				res.send(page);
			}
		});
	});
	
	app.post('/app/events/new_event', auth.auth_user, function(req,res,next){
		var new_event =req.body;
		if ( new_event == undefined ) {
			next(new Error("new event is undefined"))
			return;
		}
		var account_id = req.session.accountId;
		if ( account_id != new_event.creator._id ) {
			next(new Error("creator id != session account id"))
		}
		/**
		 * 		title: { type:String } ,
		creator_id: {type:mongoose.Schema.ObjectId},
		date_created:{type:Date, 'default':Date.now},
		due:{type:Date},
		quest_id: {type:mongoose.Schema.ObjectId},
		participants: [mongoose.Schema.ObjectId],
		active:{type:Boolean, 'default':true}
		 */
		console.log(new_event);
		var processed = {
			title: new_event.title,
			creator: new_event.creator._id,
			quest:new_event.quest._id,
		};
		models.Event.create_new(processed,{
			success:function(event) {
				res.send(event);
			},
			error: function(err){
				next(err);
			}
		})
	});
	
	app.get('/app/events/all_events',auth.auth_user,function(req,res,next){
		
		var account_id = req.session.accountId;
		if ( account_id == undefined || account_id == null ) {
			next(new Error("Cant verify account"));
		}
		models.Event.all_events({
			success:function(events) {
				res.send(events);
			},
			error:function(err){
				next(err);
			}
		});
	})
	
	return app;
}