define(['BackboneLocal','Backbone'],function(Backbone,BackboneLocal) {

	var QuestPage = BackboneLocal.Model.extend({
		initialize: function(options) {
			
		},
		url:function() {
			if (this.isNew()){
				return "/quest/"+this.get('quest').get('_id') + '/new_page';
			}else { 
				return "/quest/" + this.get('quest').get('_id')+'/page/'+this.get('_id');
			}
		},
		defaults: {
			x:220,
			y:220,
			page_name:"Untitled",
			page_type: "",
			page_number: 1,
			jointObj: undefined,
			page_content:'',
		},
		localAttrs: ['quest','jointObj'],
		get_linkable_pages: function() {
			var pages = this.get('quest').get('pages');
			var me = this;
			return pages.chain().filter( function(page) { return (
					page != me && 
					page.get('page_type') != 'surprise' 
			) } );
		}
	});
		
	return QuestPage;
	
});

