module.exports = function(params) {
	var auth = params.auth;
	var models = params.models;
	var app = params.app;
	app.post('/quest/:q_id/game/new',auth.auth_user_json,function(req,res,next){
		console.log("Starting new game");
		var quest_id = req.param('q_id');
		var account_id = req.user._id, date_started = req.body.date_started;
		
		var new_game = {
				quest_id:quest_id,
				account_id: account_id,
				date_started: date_started,
				is_at_starting_location: req.body.is_at_starting_location
		};
		
		models.Game.new_game(new_game,{
			error: function(err){ 
				next(err);
			},
			success: function(game_obj) {
				res.send(game_obj);
			}
		})
	});
	
	var push_several_to_mongo = function(model,array,value,what_to_create,res,next) {
		if ( Object.prototype.toString.call( value ) === '[object Array]' ){
			
			what_to_create.create(value, function(err) {
				if ( arguments.length <= 1 ) {
					next("Not enough arguments");
					return;
				}
				if (err) {
					next(err)
					return;
				}
				for (var i =1; i<arguments.length; i++ ){
					var m = arguments[i];
					array.push(m);
				}
				model.save(function(err,doc) {
					if (err)
						next(err);
					res.send(doc);
				});
				
			});
			
		}else {
			var val = new what_to_create(value);
			val.save(function(err,doc) {
				if ( err ) 
					next(err);
				array.push(val);
				model.save(function(err,doc) {
					if (err)
						next(err);
					res.send(doc);
				});				
			})
			
		}
	};
	
	app.post('/quest/:q_id/game/:game_id/location/new',auth.auth_user_json,function(req,res,next) {
		var game_id = req.param('game_id');
		var location_data = req.body;
		console.log("Logging location");
		console.log(location_data);
		models.Game.Game.findOne({_id:game_id}, function(err,game) {
			if ( err )
				next(new Error(err));
			push_several_to_mongo(game,game.locations,location_data,models.Game.Location,res,next);
		});
	});
	
	app.post('/quest/:q_id/game/:game_id/move/new', auth.auth_user_json,function(req,res,next) {
		var game_id = req.param('game_id');
		var quest_id = req.param('q_id');
		var move_json = req.body;
		console.log("Logging move");
		console.log(move_json);
		models.Game.Game.findOne({_id:game_id,quest_id:quest_id},function(err,game) {
			if (err || game == undefined || game == null){ next(new Error(err)); return;}
			push_several_to_mongo(game,game.moves,move_json,models.Game.Move,res,next);
			
		});
	});
	
	app.post('/quest/:q_id/review', auth.auth_user_json, function(req,res,next) {
		console.log("Submitting review " + JSON.stringify(req.body) );
		var quest_id = req.param('q_id');
		var review_json = req.body;
		
		review_json.account_id = req.user._id;
		
		if ( quest_id == null || quest_id == undefined ) {
			next(new Error("Can't locate quest without id"));
			return;
		}
		models.Quest.submit_review(quest_id,review_json,function(review){
			res.send(review);
		}, function(err) { next(err); } );
	});
	
	app.post('/game/:g_id/finish', auth.auth_user_json, function(req,res,next) {
		var game_id = req.param('g_id');
		console.log("Finishing game with id " + game_id);
		models.Game.game_over(game_id, function(game) {
			res.send(game);
		}, function(err) { next(err); });
	});
	
}