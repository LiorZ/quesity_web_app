/**
 * @author lior
 */
module.exports = function(mongoose) {
	
	var MoveSchema = new mongoose.Schema({
		date: {type:Date, 'default':Date.now},
		next_page:{type: mongoose.Schema.ObjectId, ref:'QuestPage'},
		parent_page: {type: mongoose.Schema.ObjectId, ref:'QuestPage'},
		type: {type:String},
		answer_txt:{type:String},
		lat:{type:Number},
		lng:{type:Number},
	});
	
	var GameSchema = new mongoose.Schema({
		date_started:{type:Date, 'default':Date.now},
		is_over:{type:Boolean, 'default':false},
		account: {type: mongoose.Schema.ObjectId, ref:'Account', index:true},
		quest: {type: mongoose.Schema.ObjectId, ref:'Quest', index:true},
		moves:[{type: mongoose.Schema.ObjectId, ref:'Move'}]
	});
	
	GameSchema.index({account:1, quest:1}, {unique:true});
	
	var Game = mongoose.model('Game',GameSchema);
	var Move = mongoose.model('Move',MoveSchema);
	
	var new_game = function(data,callbacks) {
		var account = data.account_id;
		var quest = data.quest_id;
		var game = new Game({account:account,quest:quest});
		game.save(function(err) {
			if ( err ) {
				callbacks.error(err);
			}else {
				callbacks.success(game);
			}
		});
	}
	
	var new_move = function(data,callbacks) {

		var game_id = data.game_id;
		Game.findOne({_id:game_id},function(err,game) {
			if ( err) {
				callbacks.error(err);
			}else {
				var move = new Move({
					next_page:data.next_page,
					parent_page: data.parent_page,
					type: data.type,
					answer_txt: data.answer_txt,
					lat: data.lat,
					lng: data.lng
				});
				
				move.save(function(err) {
					if (err) {
						callbacks.error(err);
					}else {
						game.moves.push(move);
						game.save(function(err) {
							if ( err ) {
								callbacks.error(err);
							}else {
								callbacks.success(move);
							}
						});
					}
				})
			}
		})
	}
	
	return {
		Game: Game,
		new_game:new_game,
		new_move:new_move
	}
	
}