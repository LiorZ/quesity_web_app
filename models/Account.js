

//Account.js
module.exports = function(mongoose,Quest) {
	var crypto = require('crypto');
	
	var password_setter = function(raw_password) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(raw_password);
		return shaSum.digest('hex');
	}
	
	var AccountSchema = new mongoose.Schema({
		email: { type:String, unique: true},
		password: { type:String, set:password_setter } ,
		name: { 
			first: {type:String}, 
			last: { type:String } 
		},
		date_registered:{type:Date, 'default':Date.now},
		activated:{type:Boolean, 'default':true},
		quests_playing: [{type: mongoose.Schema.ObjectId, ref:'Quest'}],
	});
	
	var Account = mongoose.model('Account',AccountSchema);
	var register = function(data,callbacks) { 
		var user = new Account({ 
			email: data.email,
			name: {
				first: data.first_name,
				last: data.last_name
			},
			password: data.password
		});
		
		user.save(function(err){
			if (err) {
				callbacks.error(err);
			}else{
				callbacks.success(user);
			}
		});
	};
	
	var login = function(email,password,callbacks) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		Account.findOne({email:email,password:shaSum.digest('hex'),activated:true},{password:0}, 
				function(err,doc) 
				{ 
					if (err || doc == null) {
						callbacks.error(err);
					}else {
						callbacks.success(doc);
					}
				});
	};
	
	
	var attach_quests = function(account,succ_callback,error_callback) {
		Quest.quests_by_account(account._id,function(quests){
			if ( quests.length > 0 ){
				account.quests = quests
			}else {
				account.quests = [];
			}
			succ_callback(account);
		},error_callback);
	}
	var get_basic_account = function(account_id, callbacks) {
		Account.findOne({_id:account_id},function(err,doc) {
			if (err || doc == null) { 
				callbacks.error(err);
			}else {
				callbacks.success(doc);
			}
		});
	}
	var get_quests_playing = function(data,callbacks) { 
		var account_id = data.account_id;
		var success = function(doc){
			doc.populate("quests_playing",function(err,res){
				if ( err ){
					callbacks.error(err);
				}else {
					callbacks.success(res.quests_playing);
				}
			});
		}
		get_basic_account(account_id,{success:success,error:callbacks.error});
	}
	
	var byId = function(id,succ_callback,err_callback) {
		
		Account.findOne({_id:id},function(err,doc){
			if (err || doc == null) {
				err_callback(err);
			}else {
				var obj_account = doc.toObject();
				delete obj_account.password;
				attach_quests(obj_account,succ_callback,err_callback);
			}
		});
	};

	var add_playing_quest = function(data,callbacks) {
		
		Account.findOneAndUpdate({_id:data.account_id},{$addToSet: {quests_playing: data.quest_id}},{},function(err,doc) {
			if (err || doc == null) {
				callbacks.error(err);
				return;
			}else{
				callbacks.success(doc);
			}
		});
	};

	
	return {
		Account:Account,
		register:register,
		login:login,
		byId: byId,
		add_playing_quest:add_playing_quest,
		attach_quests: attach_quests,
		get_quests_playing: get_quests_playing
	}
}