/**
 * @author lior
 */
module.exports = function(mongoose) {
	
	var LocationSchema = new mongoose.Schema({
		lat: {type:Number},
		lng:{type:Number},
		date:{type:Date,'default':Date.now}
	})
	
	var MoveSchema = new mongoose.Schema({
		date: {type:Date, 'default':Date.now},
		link_id:{type:mongoose.Schema.ObjectId,ref:'Link'},
		location:{type:mongoose.Schema.ObjectId,ref:'Location'}
	});
	
	var GameSchema = new mongoose.Schema({
		date_started:{type:Date, 'default':Date.now},
		is_over:{type:Boolean, 'default':false},
		account_id: {type: mongoose.Schema.ObjectId, ref:'Account', index:true},
		quest_id: {type: mongoose.Schema.ObjectId, ref:'Quest', index:true},
		moves:[{type: mongoose.Schema.ObjectId, ref:'Move'}],
		locations:[{type:mongoose.Schema.ObjectId,ref:'Location'}],
		remaining_hints:{type:Number, 'default':0}
	});
	
	GameSchema.index({account:1, quest:1});
	
	var Game = mongoose.model('Game',GameSchema);
	var Move = mongoose.model('Move',MoveSchema);
	var Location = mongoose.model('Location',LocationSchema);
	
	var new_game = function(data,callbacks) {
		var game = new Game(data);
		
		Quest.Quest.findOne({_id:data.quest_id}, function(err,quest) {
			if ( err ) {
				callbacks.error(err);
			}else {
				game.save(function(err,saved_game) {
					if ( err ) {
						callbacks.error(err);
					}else {
						callbacks.success(saved_game);
					}
				});
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
		new_move:new_move,
		Location:Location,
		Move:Move
	}
	
}