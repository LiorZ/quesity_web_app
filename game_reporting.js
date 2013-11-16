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
				date_started: date_started
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
	
	var push_several_to_mongo = function(model,array,value,what_to_create,res) {
		if ( Object.prototype.toString.call( value ) === '[object Array]' ){
			for (var i=0; i<value.length; ++i){
				var val = new what_to_create(value[i]);
				array.push(val)
			}
		}else {
			var val = new what_to_create(value);
			array.push(val);
		}
		model.save(function(err,doc) {
			if (err)
				next(err);
			res.send(doc);
		})
	};
	
	app.post('/quest/:q_id/game/:game_id/location/new',auth.auth_user_json,function(req,res,next) {
		var game_id = req.param('game_id');
		var location_data = req.body;
		console.log("Logging location");
		console.log(location_data);
		models.Game.Game.findOne({_id:game_id}, function(err,game) {
			if ( err )
				next(new Error(err));
			push_several_to_mongo(game,game.locations,location_data,models.Game.Location,res);
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
			push_several_to_mongo(game,game.moves,move_json,models.Game.Move,res);
			
		});
	});
	
}