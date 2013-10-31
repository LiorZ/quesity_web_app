define(['models/QuestPage','models/ModelAttributes','models/QuestPageLocation','models/QuestPageQuestion','models/QuestPageStall','models/QuestPageStatic',
        'models/QuestPageSurprise'],function(QuestPage,Attributes,QuestPageLocation,QuestPageQuestion,QuestPageStall,QuestPageStatic,QuestPageSurprise) {
	
	var QuestPageList = Backbone.Collection.extend({
		model: function(attrs, options) {
		    return Attributes[attrs.type].model.prototype(attrs,options);
		},
		arr:[],
		url:function() {
			console.log("Requesting the url of all pages")
			var quest_obj = this.quest;
			if (  quest_obj == undefined || quest_obj.isNew() ){
				return;
			}
			
			return '/quest/'+quest_obj.id+'/pages/'
		},
		comparator: function(page) {
			return parseInt(page.get('page_number'));
		},
		initialize:function() {
			this.listenTo(this,'add',this.add_some_listeners);
			this.listenTo(this,'remove',this.remove_from_array);
			this.arr = new Array();
		},
		add_some_listeners:function(elem) {
			elem.once("change:jointObj",this.add_joint,this);
			elem.attach_listeners();
		},
		add_joint:function(elem) {
			if (elem.get('page_type') == 'surprise')
				return;
			this.arr.push(elem.get('jointObj'));
		},
		remove_from_array:function(elem){ 
			var arr = this.arr;
			var j = elem.get('jointObj');
			var ind = arr.indexOf(j);
			if ( ind < 0 )
				return;
			arr.splice(ind,1,j);
		},
		byPageNumber:function(number){
			return this.filter(function(page){
				return page.get('page_number') == number;
			})[0];
		},
		byJointObject:function(joint_obj){
			var res= this.filter(function(object){
				return object.get('jointObj') == joint_obj.wholeShape;
			});
			if ( res == undefined )
				return undefined;
			if ( res.length != 1 ){
				alert("ERROR: Not one joint per page");
				return undefined;
			}
			return res[0];
		},
		as_joints_array:function() {
			return this.arr;
			/* we keep this array to allow the use of "RegisterForever" of joint which is much more elegant and efficient
			and elegant than using events..
			*/
		},
		get_next_page_num:function(){
			var collection = this;
			var item = this.find(
					function(page) {
						return page.get('page_number') != collection.indexOf(page)+1;
					}
			);
			if ( _.isUndefined(item) ) {
				return collection.length+1;
			}else{
				return this.indexOf(item)+1;
			}
		}
		
	});
	
	return QuestPageList;
});