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
	
	app.get('/my_quests', function(req,res,next) {
		var account_id = req.session.accountId;
		models.Account.get_quests_playing(account_id,{
			success: function(quests) {
				res.send(quests);
			},
			error: function(err) {
				next(new Error("Error finding quests for this user"));
			}
		})
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
	
	return app;
}