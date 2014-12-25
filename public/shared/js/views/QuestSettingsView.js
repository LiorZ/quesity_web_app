/*
 * TODO:
 * 1) add tag auto-complete
 * 2) add model validation.
 */

define(['models/Quest','Backbone','text!shared_templates/quest_settings_dialog.html','shared_views/MapView','shared_views/PageSelectionBox','models/QuestPage'],
		function(Quest,Backbone,quest_dialog_template,MapView,PageSelectionBox,QuestPage) {
	var QuestSettingsView = Backbone.View.extend({
		events: {
			'click #btn_open_map':'open_map',
			'change #txt_radius':'change_radius',
			'spinstop #txt_radius':'change_radius',
			'click #btn_add_image' :'add_image_to_gallery',
			'mouseenter .ad-image-wrapper':'show_del_btn',
			'mouseleave .ad-image-wrapper':'hide_del_btn',
			'mouseenter #btn_del_img':'clear_hidbtn_timeout',
			'mouseleave #btn_del_img':'hide_del_btn',
			'click #btn_del_img':'delete_image_from_gallery',
		},
		gallery_timeout_id:-1,

		orient_del_btn: function(  ) {
			console.log("orienting...")
			if ( $('#btn_del_img').is(":visible") ) {
				console.log("button is visible")
				this.show_del_btn();
			}
		},

		delete_image_from_gallery:function() {
			var context =this;
			var src = $('.ad-image img').attr('src')
			if ( _.isUndefined(src) || src.length == 0 ) {
				alert("Error deleting image");
				return;
			}
			var images = this.model.get('images');
			var index = _.indexOf(images,src);
			if ( index < 0  ) {
				alert("Error deleting image!");
				return;
			}
			this.model.set('images',_.without(images,src));
			this.model.save(null,{success:function() {
				context.image_gallery[0].removeImage(index);
				var images = context.model.get('images');
				if (images.length > 0 ) {
					var to_show = index;
					if ( index == images.length )
						to_show = index-1;
					context.image_gallery[0].showImage(to_show);
				}else {
					$('.ad-gallery').hide();
					$('#btn_del_img').hide();
				}
			},
			error: function(){
				alert("Error deleting image!");
			}})

		},
		clear_hidebtn_timeout:function() {
			console.log("clear_hidebtn_timeout");
			clearTimeout(this.gallery_timeout_id);
		},
		hide_del_btn:function(ev) {
			var context = this;
			clearTimeout(this.gallery_timeout_id);
			context.gallery_timeout_id = setTimeout(function(){
				var button = context.$el.find('button[name="btn_del_img"]')
				button.hide();
			},2000);

		},

		show_del_btn:function(ev) {
			if ( this.model.get('images').length == 0 ) {
				return;
			}
			this.clear_hidebtn_timeout();
			var img = $('.ad-image');
			var button = this.$el.find('button[name="btn_del_img"]').zIndex(10000);
			button.show();

			button.position({
				of: img,
				my: "left top",
				at: "left top"
			});
		},
		id:'#dialog_container',

		add_image_to_gallery: function() {
			var images = this.model.get('images');
			var img_address =this.$el.find('#txt_image_url').val();
			if ( img_address == '' ) {
				alert("Please enter a valid address");
				return;
			}else if ( _.indexOf(images,img_address) >= 0 ) {
				alert("This image already exists in the gallery");
				this.$el.find('#txt_image_url').val('');
				return;
			}
			this.$el.find('#txt_image_url').val('');
			$('.ad-gallery').show();
			this.image_gallery[0].addImage(img_address,img_address);
			images.push(img_address);
			this.image_gallery[0].showImage(images.length - 1);
			this.model.save();
		},

		change_radius:function() {
			var radius = this.$el.find('#txt_radius').val();
			console.log("Setting radius "+ radius);
			this.model.get('starting_location').set('radius',radius);
		},
		initialize: function(options) {
			this.title = '' || options.title;
			this.should_open_editor = options.should_open_editor;
			var tmpl = _.template(quest_dialog_template);
			this.$el.html(tmpl(this.model.toJSON()));
		},
		open_map:function() {
			var context = this;
			var map_view = new MapView({model:context.model.get('starting_location'), dialog_id:'#dlg_create_quest'});
			$('#map_container').append(map_view.render());
			$('#map_container').dialog({
				autoOpen : true,
				title:'Choose starting location',
				modal:true,
				width:550,
				draggable:true,
				close:function() {
					$('#map_container').html('');
					map_view.remove();
				},
				buttons:{
					OK: {
						text:"OK",
						click: function() {
							var starting_location = {
//								street: context.$el.find('#txt_street').val(),
								radius: context.$el.find('#txt_radius').val(),
								lat:context.$el.find('#txt_lat').val(),
								lng:context.$el.find('#txt_lng').val()
							};
							context.model.set('starting_location',starting_location);
							$('#map_container').html('');
							map_view.remove();
							$(this).dialog('close');
						}
					},
				}
			});
			map_view.resize();

		},

		set_access_restriction:function() {
			var current_restriction = this.model.get("access_restriction");
			var option = this.$el.find("#access_restriction option[value='"+current_restriction+"']");
			if ( _.isNull(option) || _.isUndefined(option) || option.length == 0 ) {
				return;
			}
			option.attr("selected","selected");

		},

		render:function(){
			var context = this;

			this.$el.find('button').button();
			this.$el.find('button[name="btn_edit"]').button({ icons: {primary: 'ui-icon-pencil'}});
			this.$el.find('button[name="btn_del_img"]').button({text:false, icons:{primary:'ui-icon-trash'}}).hide().mouseenter(function() {
				console.log("clear_hidebtn_timeout");
				clearTimeout(context.gallery_timeout_id);
			});
			this.$el.find('#tabs').tabs();
			this.$el.find('#tags').tagit();
			this.init_gallery();

			this.$el.find('#allowed_hints, #allowed_public_questions, #allowed_location_finders, #txt_radius, #played, #distance').spinner({min:0});
			this.$el.find('#rating').spinner({step:0.1,min:0,max:5});
			var time_spinner = this.$el.find('#time').spinner({
				min:0,
				page:1
			}).data('ui-spinner');

			time_spinner._format = function(value) {
				console.log("FORMAT " + value);
				var h = Math.floor(parseInt(value)/60);
				var m = value%60;
				if ( m < 10 )
					m= '0' +m;
				return h+':'+m;
			};
			time_spinner._parse = function(value) {
				if (typeof value == typeof 1){
					return value;
				}
				if (value.indexOf(":") != -1){
					var arr = value.split(':');
					var time = parseInt(arr[0])*60 + parseInt(arr[1]);
					return time;
				}else {
					return parseInt(value);
				}
			};

			//Refreshing the spinner:
			this.$el.find('#time').spinner('pageUp');
			this.$el.find('#time').spinner('pageDown');

			//Setting access restriction:
			this.set_access_restriction();

			var dialog_obj = this.$el.find('#dlg_create_quest');
			this.$el = this.$el.find('#dlg_create_quest').dialog(
					{
						autoOpen : true,
						title : context.title,
						width:800,
						height:650,
						modal : true,
						draggable:false,

						create: function() { // turn tabs into dialogs
							// define the elements we're dealing with
							$tabs = $(this).find('.ui-tabs-nav'); $dlg = $(this).parent();
							// clone close button from dialog title and put it in the tabs area
							$dlg.find('.ui-dialog-titlebar-close').appendTo($tabs);
							// make the tabs draggable, give it a class that gracefully adds the move cursor and remove the dialog's original titlebar completely
							$dlg.draggable({handle: ".ui-tabs-nav"})
								.addClass('ui-draggable')
								.find('.ui-dialog-titlebar').remove();
							// give dialog styles to the tabs (would like to do this without adding CSS, but couldn't)
				 			$dlg.find('.ui-tabs').css('padding', '0px');
							// turn off the highlighting of tabs in chrome, add titlebar style to tabs to give close button correct styling
							$tabs.addClass('ui-dialog-titlebar')
								.find('li, a').css('outline', 'none').mousedown(function(e){ e.stopPropagation(); });

						},
						close: function(){
							context.remove();
						},
						buttons : {
							Save :{
									id: 'create_quest_ok',
									text:'Save',
									click: function() {
										quest_data = {
												title: dialog_obj.find('#title').val(),
												description: dialog_obj.find('#description').val(),
												allowed_hints: dialog_obj.find('#allowed_hints').val(),
												allowed_public_questions: dialog_obj.find('#allowed_public_questions').val(),
												allowed_location_finders: dialog_obj.find('#allowed_location_finders').val(),
												starting_location: {
													street: dialog_obj.find('#street_address').val(),
													radius: dialog_obj.find('#txt_radius').val(),
													lat:dialog_obj.find('#txt_lat').val(),
													lng:dialog_obj.find('#txt_lng').val()
												},
												access_restriction:dialog_obj.find("#access_restriction option:selected").val(),
												rating: dialog_obj.find('#rating').val(),
												games_played: dialog_obj.find('#played').val(),
												time: dialog_obj.find('#time').spinner('value'),
												map_url: dialog_obj.find('#map_url').val(),
												distance: dialog_obj.find('#distance').val(),
												tags:jQuery.makeArray(dialog_obj.find("#tags").tagit("assignedTags")),
												quest_type: dialog_obj.find("#quest_type").val(),
												ages: dialog_obj.find("#ages").val()

										}
										context.model.set(quest_data);
										$(this).dialog('close');
										context.create_new_quest();

									}
							},
							Cancel : function() {
								$(this).dialog('close');
								context.remove();
							}
						}
					});
			if ( this.model.get('images').length == 0 ){
				$('.ad-gallery').hide();
			}

			$('#properties').scroll(_.bind(context.orient_del_btn,context));
			this.page_selection_box = new PageSelectionBox({el:'#select_first_page',change_listener:function(new_page_id) {
				var first_page = context.model.get('pages').where({is_first:true});
				if (first_page.length > 1){
					alert("Assertion: More than one first page!")
				}
				if ( first_page.length == 1 ){
					first_page[0].set('is_first',false);
					first_page[0].save(null);
				}

				var new_page = QuestPage.findOrCreate(new_page_id,{create:false});
				new_page.set('is_first',true);
				new_page.save(null);
			}});

			var first_page = this.model.get('pages').findWhere({is_first:true});
			this.page_selection_box.render(first_page);
			this.delegateEvents(this.events);
		},

		create_new_quest : function() {
			var open_editor = this.should_open_editor;
			var context = this;
			this.model.save(
							null,
							{
								success : function() {
									if ( open_editor )
										window.location = '/editor/'+ context.model.id;
								},
								error : function() {
									alert("Could not create new quest. check your connection");
								}
							});
		},

		init_gallery:function() {
			var context = this;
			this.image_gallery = this.$el.find('.ad-gallery').adGallery({
				  loader_image: '/shared/js/lib/jquery-ui/plugins/ADGallery/loader.gif',
				  // Width of the image, set to false and it will
				  // read the CSS width
				  width: 400,
				  // Height of the image, set to false and it
				  // will read the CSS height
				  height: 200,
				  thumbs_wrapper:true,
				  thumbs_wrapper_width:400,
				  // Opacity that the thumbs fades to/from, (1 removes fade effect)
				  // Note that this effect combined with other effects might be
				  // resource intensive and make animations lag
				  thumb_opacity: 0.7,
				  // Which image should be displayed at first? 0 is the first image
				  start_at_index: 0,
				  // Whether or not the url hash should be updated to the current image
				  update_window_hash: false,
				  // Either false or a jQuery object, if you want the image descriptions
				  // to be placed somewhere else than on top of the image
				  description_wrapper: false,
				  // Should first image just be displayed, or animated in?
				  animate_first_image: false,
				  // Which ever effect is used to switch images, how long should it take?
				  animation_speed: 400,
				  // Can you navigate by clicking on the left/right on the image?
				  display_next_and_prev: true,
				  // Are you allowed to scroll the thumb list?
				  display_back_and_forward: true,
				  // If 0, it jumps the width of the container
				  scroll_jump: 0,
				  slideshow: {
				    enable: false,
				    autostart: true,
				    speed: 5000,
				    start_label: 'Start',
				    stop_label: 'Stop',
				    // Should the slideshow stop if the user scrolls the thumb list?
				    stop_on_scroll: true,
				    // Wrap around the countdown
				    countdown_prefix: '(',
				    countdown_sufix: ')',
				    onStart: function() {
				      // Do something wild when the slideshow starts
				    },
				    onStop: function() {
				      // Do something wild when the slideshow stops
				    }
				  },
				  // or 'slide-vert', 'resize', 'fade', 'none' or false
				  effect: 'slide-hori',
				  // Move to next/previous image with keyboard arrows?
				  enable_keyboard_move: true,
				  // If set to false, you can't go from the last image to the first, and vice versa
				  cycle: true,
				  // All hooks has the AdGallery objects as 'this' reference
				  hooks: {
				    // If you don't want AD Gallery to handle how the description
				    // should be displayed, add your own hook. The passed image
				    // image object contains all you need
				    displayDescription: function(image) {
//				      alert(image.title +" - "+ image.desc);
				    }
				  },
				  // All callbacks has the AdGallery objects as 'this' reference
				  callbacks: {
				    // Executes right after the internal init, can be used to choose which images
				    // you want to preload
				    init: function() {
				      // preloadAll uses recursion to preload each image right after one another
				      this.preloadAll();

				    },
				    // This gets fired right after the new_image is fully visible
				    afterImageVisible: function() {
				      // For example, preload the next image
				      var context = this;
				      this.loading(false);
//				      this.preloadImage(this.current_index + 1,
//				        function() {
////				          context.loading(false);
//				        }
//				      );

				      // Want slide effect for every other image?
				      if(this.current_index % 2 == 0) {
				        this.settings.effect = 'slide-hori';
				      } else {
				        this.settings.effect = 'fade';
				      }
				    },
				    // This gets fired right before old_image is about to go away, and new_image
				    // is about to come in
				    beforeImageVisible: function(new_image, old_image) {
				      this.loading(false);
				    }
				  }
				});

			this.image_gallery[0].showImage(0,function() {
				this.loading(false);
			});
		}
	});

	return QuestSettingsView;
});
