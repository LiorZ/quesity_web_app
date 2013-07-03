module.exports = function(mongoose,Quest,Account) {
	var EventSchema = new mongoose.Schema({
		title: { type:String , required: true } ,
		creator: {type:mongoose.Schema.ObjectId, ref:'Account' , required: true },
		date_created:{type:Date, 'default':Date.now},
		due:{type:Date},
		quest: {type:mongoose.Schema.ObjectId, ref:'Quest' , required: true },
		participants: [{type: mongoose.Schema.ObjectId, ref:'Account'}],
		active:{type:Boolean, 'default':true}
	});
	
	var Event = mongoose.model('Event',EventSchema);
	
	var create_new = function(data,callbacks) {
		var new_event = new Event(data);
		new_event.participants.push(data.creator);
		new_event.save(function(err) {
			if ( err ) {
				callbacks.error(err);
			}
			else { 
				new_event.populate('creator','_id name')
				.populate('participants','_id name')
				.populate('quest',function(err,doc) {
					if ( err ) {
						callbacks.error(err);
					}else {
						callbacks.success(doc);	
					}
					
				});
				
			}
		});
	}
	
	var byId = function(data,callbacks) {
		
		var event_id = data.event_id;
		Event.findOne({_id:event_id},function(err,doc) {
			if ( err ) {
				callbacks.error(err);
			}else {
				callbacks.success(doc);
			}
		});
	}
	
	var add_participant = function(data,callbacks) {
		var event_id = data.event_id;
		var participant_id = data.participant_id;
		byId({event_id:event_id},{
			error:callbacks.error,
			success: function(doc) {
				doc.participants.push(participant_id);
				doc.save(function(err){
					if (err) {
						callbacks.error(err)
					}else {
						
						callbacks.success(doc);
					}
				})
			}
		});
		
	}

	var all_events = function(callbacks) {
		Event.find({}, function(err,doc) {
			if ( err ) {
				callbacks.error(err);
			}else {
				callbacks.success(doc)
			}
		})
	};
	
	var events_for_account = function(data,callbacks){
		var account_id = data.account_id;
		Event.find({participants:[account_id]},
				function(err,doc) {
					if ( err ) {
						callbacks.error(err);
					}else {
						callbacks.success(doc);
					}
		});
	}
	
	
	var get_event_data = function(data,callbacks) {
	}
	
	return {
		Event: Event,
		all_events: all_events,
		add_participant: add_participant,
		create_new: create_new,
		events_for_account: events_for_account
	}
}