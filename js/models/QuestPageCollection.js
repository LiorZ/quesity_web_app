var app = app || {};

(function() {
	
	var QuestPageList = Backbone.Collection.extend({
		model: app.QuestPage,
		arr:[],
		initialize:function() {
			this.listenTo(this,'add',this.add_joint_listener);
			this.listenTo(this,'remove',this.remove_from_array);
			this.arr = new Array();
		},
		add_joint_listener:function(elem) {
			elem.once("change:jointObj",this.add_joint,this);
		},
		add_joint:function(elem) {
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
				console.log(object);
				console.log(joint_obj);
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
		}
		
	});
	
	app.Pages = new QuestPageList();
}());