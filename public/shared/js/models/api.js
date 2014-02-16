define(['config'],function(config) {
	var api = {
		register_facebook: config.server_url + '/register/facebook',
		new_game: function(quest_id) {
			return config.server_url + "/quest/"+quest_id+"/game/new";
		},
		all_quest_pages: function(quest_id) {
			return config.server_url + "/quest/" + quest_id + "/pages";
		}
	};

	return api;
});
