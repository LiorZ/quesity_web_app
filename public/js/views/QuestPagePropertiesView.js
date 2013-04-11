var app = app || {};
$(function() {
	
	app.QuestPagePropertiesView = Backbone.View.extend({
		template: undefined,
		id:'#dialog-form',
		className:'quest_page',
		hint_section:undefined,
		events: {
			'click #btn_exit_prop': 'exit_properties_view',
			'focusout #page_title_text':'save_page_title',
			'keypress #page_title_text':'handle_enter_on_title'
		},
		initialize: function(options) {
			this.template = _.template( $(options.template).html() );
		},
		exit_properties_view: function() {
			app.Router.navigate("show_diagram",{trigger: true});
		},
		
		handle_enter_on_title:function(e) {
			if ( e.keyCode == consts.ENTER_KEY_CODE)
				this.$("#page_title_text").blur();
		},
		
		save_page_title:function() {
			var title = this.$("#page_title_text").val();
			this.model.set("page_name",title);
		},
		save_page_contents:function() { 
			this.model.set('page_content',this.$('#content_editor').html());
		},
		render:function() {
			var type_obj = app.Attributes[this.model.get('page_type')];
			var fill_color = utils.hexToRgb(type_obj.view.fill);
			this.$el.html(this.template({data:this.model.toJSON()}));
			var size = utils.precentToPixels(0.85);
			this.$el.css({
				display: 'inline',
				width: size.width,
				height: size.height,
				'background-color': 'rgba(' + fill_color.r +',' + fill_color.g + ',' + fill_color.b + ',' +'0.8)'

			});
		    this.$el.css("top", Math.max(0, (($(window).height() - this.$el.outerHeight()) / 2) + 
                    $(window).scrollTop()) + "px");
		    this.$el.css("left", Math.max(0, (($(window).width() - this.$el.outerWidth()) / 2) + 
                    $(window).scrollLeft()) + "px");
		    
		    this.$('img').attr('src',type_obj.view.avatar);
		    this.$('#type_title').text(type_obj.view.type_title);
		    this.$('#locations').tablesorter();
		    
		    $('body').append(this.$el);
		    var context = this;
		    _.bindAll(context);
			this.$('#content_editor').tinymce({
				// Location of TinyMCE script
				script_url : 'js/lib/tiny_mce/tiny_mce.js',

				// General options
				theme : "advanced",
				plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",

				// Theme options
				theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
				theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
				theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
				theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "left",
				theme_advanced_statusbar_location : "bottom",
				theme_advanced_resizing : true,

				// Drop lists for link/image/media/template dialogs
				template_external_list_url : "lists/template_list.js",
				external_link_list_url : "lists/link_list.js",
				external_image_list_url : "lists/image_list.js",
				media_external_list_url : "lists/media_list.js",
				theme_advanced_resizing : false,
				 init_instance_callback: context.set_content_in_editor

			});
		},
		set_content_in_editor:function() {
			this.$('#content_editor').tinymce().execCommand('mceInsertContent',false,this.model.get('page_content'));
		}
	});
}());