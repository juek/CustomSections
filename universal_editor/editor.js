/*
###################################################################################
Universal Editor Javascript for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
###################################################################################
*/


function gp_init_inline_edit(area_id, section_object){

  /* DEBUG level 3 */ if( CustomSections_editor.debug_level > 2) { console.log("section_object = ", section_object); }
 
  $.each(CustomSections_editor.css, function(i, css_file){
    $gp.LoadStyle( css_file, true ); // true for (boolean)alreadyprefixed
  });

  gp_editing.editor_tools();

  gp_editor = {
    section_object        : section_object,
    edit_section          : gp_editing.get_edit_area(area_id),
    save_path             : gp_editing.get_path(area_id),
    destroy               : function(){},
    intervalSpeed         : function(){},
    SaveData              : function(){},
    checkDirty            : function(){},
    resetDirty            : function(){},
    isDirty               : false,

    getFormElements       : function(){},
    cacheValue            : '',
    resetCache            : function(){},
    updateSection         : function(){},
    setResponse           : function(){},

    selectUsingFinder     : function(){},
    setFile               : function(){},

    CKfield               : function(){},
    updateCKfield         : function(){},
    destroyCK             : function(){},

    addImage              : function(){},
    removeImage           : function(){},
    setImage              : function(){},
    isImage               : function(){},

    saveBunchControlsOrder : function(){},
    editBunchControl      : function(){},
    addBunchControl       : function(){},
    updateBunchControl    : function(){},
    deleteBunchControl    : function(){},
	

    buildEditorUI         : function(){},
    getControl            : function(){},
    controls              : {},
    ui                    : {}
  }; 



  /* ################################################ */
  /* #####                                      ##### */
  /* #####           F U N C T I O N S          ##### */
  /* #####                                      ##### */
  /* ################################################ */


  gp_editor.SaveData = function(){
    var values = gp_editor.getFormElements().serialize();
    var content = encodeURIComponent( gp_editor.edit_section.html() );
    return 'gpcontent=' + content + '&' + values;
  }; // gp_editor.SaveData --end



  gp_editor.getFormElements = function(){
    var form_elements = gp_editor.ui.controls
      .find("input:not(.editor-ctl-no-submit, [type='checkbox'], [type='radio']), select, textarea");
    return form_elements;
  }; // gp_editor.getFormElements --end



  gp_editor.updateSection = function(){
    loading();
    var values_serialized = gp_editor.getFormElements().serializeArray();
    var data = {
      cmd   : 'save_custom_section',
      type  : section_object.type,
    };

	$.each(values_serialized, function(i, item) {
	if( item.name.slice(-2) =="[]"){
		var test=item.name.slice(0, -2);
		data[test]=[];
	}
		});
	
	$.each(values_serialized, function(i, item) {
 		if( item.name.slice(-2) =="[]"){
			var test=item.name.slice(0, -2);
			data[test].push(item.value);
		} else { 
			data[item.name] = item.value;
		}
		});
	
    data = jQuery.param(data);
    $gp.postC(window.location.href, data);
  }; // gp_editor.updateSection --end



  gp_editor.setResponse = function(){
    $gp.response.updateContent = function(arg){
      gp_editor.edit_section
        .html(arg.CONTENT)
        .trigger("CustomSection:updated");
      gp_editor.isDirty = true; // this will tell Typesetter to autosave section including content
      gp_editor.resetCache(); // this will reset the values cache
      if( typeof(CustomSections) != 'undefined' && typeof(CustomSections.onUpdate) == "function" ){
        CustomSections.onUpdate.call(gp_editor.edit_section);
      }
      loaded();
      // execute js_on_content defined in editor.php
      eval(CustomSections_editor.js_on_content);
    };
  }; // gp_editor.setResponse --end



  gp_editor.checkDirty = function(){
    var values = gp_editor.getFormElements().serialize();
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 2 ){ console.log("getFormElements = " + values);  console.log("cacheValue = " + gp_editor.cacheValue); }
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 1 ){ console.log("checkDirty returns " + (gp_editor.isDirty ? "true" : "false") ); }
    if( values != gp_editor.cacheValue ){
      gp_editor.updateSection(); // will now also set gp_editor.isDirty = true and call gp_editor.resetCache() after section update finished
    }
    return gp_editor.isDirty;
  }; // gp_editor.checkDirty --end



  gp_editor.resetDirty = function(){
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 1 ){ console.log("gp_editor.resetDirty called"); }
    gp_editor.isDirty = false;
  }; // gp_editor.resetDirty --end



  gp_editor.resetCache = function(){
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 1 ){ console.log("gp_editor.resetCache called"); };
    gp_editor.cacheValue = gp_editor.getFormElements().serialize();
  }; // gp_editor.resetCache --end



  gp_editor.selectUsingFinder = function(callback_fn, input_selector){
    gp_editor.FinderSelect = function(fileUrl){ 
      if (fileUrl != "") {
        $.isFunction(callback_fn) ? callback_fn(fileUrl, input_selector) : false;
      }
      setTimeout(function(){
        delete gp_editor.FinderSelect;
      }, 150);
      return true;
    };
    var finderPopUp = window.open(gpFinderUrl, 'gpFinder', 'menubar=no,width=960,height=450');
    if( window.focus ){ 
      finderPopUp.focus(); 
    }
  }; // gp_editor.selectUsingFinder --end



  gp_editor.setFile = function(fileUrl, input_selector){
	//bunch control support
	if (input_selector.endsWith('-bunch_box')){
		$gp.div('gp_admin_box').find(input_selector).val(fileUrl).trigger("change");
	}	else {
		 gp_editor.ui.controls.find(input_selector).val(fileUrl).trigger("change");
	}
  }; // gp_editor.setFile --end



  gp_editor.CKfield = function(callback_fn, input_selector, label) {
    if( typeof(gp_add_plugins) == 'object' ){
      $.each(gp_add_plugins,function(name,path){
        CKEDITOR.plugins.addExternal(name,path);
      });
    }
    var content = gp_editor.ui.controls.find("#" + input_selector).val(); //.html();
    var boxHtml = '<div class="inline_box">'
    + '<h3>' + label + '</h3>'
    + '<textarea id="ck_field" name="ck_field" data-inp-selector="' + input_selector + '" cols="50" rows="3">' + $gp.htmlchars(content) + '</textarea>'
    + '<p><input class="gpsubmit" type="submit" name="" onclick="gp_editor.updateCKfield()" value="' + gplang.up + '" /> '
    + '<input class="gpcancel gp_admin_box_close" data-cmd="admin_box_close" onclick="gp_editor.destroyCK()" type="button" name="" value="' + gplang.ca + '" /></p>'
    + '</div>';
    $gp.AdminBoxC(boxHtml);
    CKEDITOR.config.baseFloatZIndex = 12000;
    CKEDITOR.replace("ck_field", CS_ckconfig);
  }; // gp_editor.CKfield --end



  gp_editor.destroyCK = function() {
    CKEDITOR.instances['ck_field'].destroy();
  }; // gp_editor.destroyCK --end



  gp_editor.updateCKfield = function() {
    gp_editor.destroyCK();
    var caption = $("#ck_field").val();
    var input_selector = $("#ck_field").attr("data-inp-selector")
    gp_editor.ui.controls.find("#"+input_selector).val(caption);
    $gp.CloseAdminBox();
  }; // gp_editor.updateCKfield --end



  gp_editor.addImage = function(fileUrl, item){
    if( gp_editor.isImage(fileUrl.toString()) ){ 
      var list_item = $('<li style="background-image:url(\'' + fileUrl + '\');">'
       +    '<div class="remove-img-btn" title="Remove Image"><i class="fa fa-times"></i></div>'
       +    '<input type="hidden" name="values[' + item + '][]" value="' + fileUrl + '"/>'
       +  '</li>')
        .appendTo("#multi-img-list-" + item)
        .find(".remove-img-btn").on("click", gp_editor.removeImage);
      // possible re-inits here
    }
  }; // gp_editor.addImage --end



  gp_editor.removeImage = function(e){
    $(this).closest("li").remove();
    // possible re-inits here
  }; // gp_editor.removeImage --end



  gp_editor.isImage = function(fileUrl){
   var filetype = fileUrl.substr(fileUrl.lastIndexOf('.') + 1);
    if( !filetype.match(/jpg|jpeg|png|gif|svg|svgz|mng|apng|webp|bmp|ico/i) ){
      window.setTimeout(
        function() {
        alert("Please choose an image file! " 
          + "\nValid file formats are: *.jpg/jpeg, *.png/mng/apng, "
          + "*.gif, *.svg/svgz, *.webp, *.bmp, *.ico");
        }, 300
      );
      return false;
    }
    return true;
  }; // gp_editor.isImage --end

  
    gp_editor.saveBunchControlsOrder = function(container) {
		var sort_order = container.sortable( "toArray", {attribute: 'data-sort'});
		container.parent().find('#sort_order').val(sort_order);
	}// gp_editor.saveBunchControlsOrder --end
  

  
   gp_editor.editBunchControl = function(max_bunch=false,sub_controls) {
		var bunch_label = sub_controls[[Object.keys(sub_controls)[0]]]['bunch_label'];
		var bunch_number = sub_controls[[Object.keys(sub_controls)[0]]]['bunch_number'];
		var boxHtml = '<div class="inline_box">';
			boxHtml +='<h3>'+bunch_label+" "+bunch_number+'</h3>';
			boxHtml +='<div class="sub_controls_cont"></div>';
			
			if(!max_bunch){
			boxHtml +='<p><input class="gpsubmit" type="submit" name="updateBunchControl" value="' + gplang.up + '" /> ';
			} else {
			boxHtml +='<p><input class="gpsubmit" type="submit" name="addBunchControl" value="' + gplang.up + '" /> ';	
			}
			boxHtml +='<input class="gpcancel gp_admin_box_close" data-cmd="admin_box_close"  type="button" name="" value="' + gplang.ca + '" /></p>';
			boxHtml +='</div>';
		$gp.AdminBoxC(boxHtml);
		//sub controls adding   (ck_editor goes separeted)
		var contr_types =["color","date","datetime","datetime-local","email","number","month","password","range","search","tel","text","time","url","week"];
		$.each(sub_controls, function(item, value){ 
			if( jQuery.inArray(value['control_type'], contr_types) !== -1 ){
				 value['control_type']='input_field';
			 }
		
			if (value['control_type']=="ck_editor") {
				var ck_field ='<textarea id="editor-ctl-' + item + '" name="values[' + value.item + ']" cols="50" rows="3">' + $gp.htmlchars(value.value) + '</textarea>';
				$gp.div('gp_admin_box').find(".sub_controls_cont").append(ck_field);
						if( typeof(gp_add_plugins) == 'object' ){
								$.each(gp_add_plugins,function(name,path){
								CKEDITOR.plugins.addExternal(name,path);
								});
						}
						CKEDITOR.config.baseFloatZIndex = 12000;
						CKEDITOR.replace('editor-ctl-' + item, CS_ckconfig);
						CKEDITOR.instances['editor-ctl-' + item].on('change', function() { CKEDITOR.instances['editor-ctl-' + item].updateElement() })
			} else {
				var control = gp_editor.getControl(value['control_type'], value);
				$gp.div('gp_admin_box').find(".sub_controls_cont").append(control);
			}
			
		})
		
		$gp.div('gp_admin_box').find("[name='updateBunchControl']").on("click", function(){
			gp_editor.updateBunchControl();
		  });	
		 $gp.div('gp_admin_box').find("[name='addBunchControl']").on("click", function(){
			gp_editor.addBunchControl(sub_controls);
		  });
   }// gp_editor.editBunchControl --end
	
	
	
	gp_editor.addBunchControl = function(sub_controls){
		var bunch_data=$(".sub_controls_cont").find("input:not(.editor-ctl-no-submit, [type='checkbox'], [type='radio']), select, textarea").serializeArray();
		var i = sub_controls[[Object.keys(sub_controls)[0]]]['bunch_number'];//from first property it's same everywhere
		var bunch_name = sub_controls[[Object.keys(sub_controls)[0]]]['bunch_name'];
		var bunch_label = sub_controls[[Object.keys(sub_controls)[0]]]['bunch_label'];
	
		var new_bunch = '<div id="bunch-item-'+bunch_name+'-'+i+'" data-sort="'+i+'" class="bunch_item" ><p>'+bunch_label+i+'</p>';
		$.each(bunch_data,function(a,item){
			var temp = item.name.replace('values[','');
			temp=temp.slice(0, -1);
			sub_controls[temp]['value'] = item.value;
		});
		$.each(sub_controls,function(a,map){ 
			 var sub_control_data=JSON.stringify(map).replace(/'/g, "\\'");;
			new_bunch +='<input data-item="'+bunch_name+i+map.sub_name+'-bunch_box" data-subname="'+map.sub_name+'" data-control=\''+sub_control_data+'\' type="hidden" name="values[' + bunch_name + ']['+i+']['+map.sub_name+']" value="' + map.value + '"/>';
			
			//changes to use sub_controls, for edit new added bunch-control
			map['item'] = map.bunch_name+i+map.sub_name+'-bunch_box';
			
		});
		new_bunch += '<div title="Edit" class="edit-bc-btn"><i class="fa fa-pencil"></i></div>';
		new_bunch += '<div title="Remove" class="remove-bc-btn"><i class="fa fa-times"></i></div>';
		new_bunch +="</div>";
		
		//change subcontrols to be ready for new bunch control edit ( rename properties - adding number to property )
		$.each(sub_controls,function(a,map){ 
			var new_prop_name = map.bunch_name+i+map.sub_name+'-bunch_box';
			sub_controls[new_prop_name]=map;
			delete sub_controls[a];
		})

		$(new_bunch).appendTo("."+bunch_name+"_bunch_items_container")
			.find(".edit-bc-btn, .remove-bc-btn").each(function() {
				$(this).on('click', function(e) {	
					 var target = $( e.currentTarget );
					if (target.is('div.edit-bc-btn')) { 
							$(this).parent().find("input").each(function(){
								var key = $(this).data('item');
								sub_controls[key]['value'] = $(this).val();
							});
						gp_editor.editBunchControl('',sub_controls);
					
						} else {
						gp_editor.deleteBunchControl($(this));
						}
				
				})	
			})
		gp_editor.ui.controls.find('#dummy-'+bunch_name).data("bunchcount", i);
		$gp.CloseAdminBox();
	}// gp_editor.addBunchControl --end
  
  
  
	gp_editor.updateBunchControl = function(){
		var bunch_data=$(".sub_controls_cont").find("input:not(.editor-ctl-no-submit, [type='checkbox'], [type='radio']), select, textarea").serializeArray();
		$.each(bunch_data,function(i,item){
			var temp = item.name.replace('values[','');
			temp=temp.slice(0, -1);
			gp_editor.ui.controls.find('input[data-item='+temp+']').val(item.value);
			$gp.CloseAdminBox();
		
		});
	}// gp_editor.updateBunchControl --end
	
	
	
	gp_editor.deleteBunchControl =function(e){
		if( confirm("Really delete?") ){
/* 			var count = e.parent().parent().parent().find(".bunch-ctr-dummy");
			var  count_data =  count.data("bunchcount") - 1;
			count.data("bunchcount",count_data) */
			e.parent().remove(); 
		  } 
	}// gp_editor.deleteBunchControl --end
	
	
	
	function escapeHtml(unsafe) {
		return unsafe
			 .replace(/&/g, "&amp;")
			 .replace(/</g, "&lt;")
			 .replace(/>/g, "&gt;")
			 .replace(/"/g, "&quot;")
			 .replace(/'/g, "&#039;");
	}
	
		
	function log(a){
		console.log(a);
	}


  gp_editor.buildEditorUI = function(){
    gp_editor.ui.controls = $('<div id="option_area"></div>').prependTo('#ckeditor_controls');

    $.each(section_object.values, function(item, value){
      if( item in CustomSections_editor.controls ){
        var control_map = CustomSections_editor.controls[item];
        control_map['item'] = item;
        control_map['value'] = value;
        var control_type = control_map['control_type'];

        /* DEBUG level 3 */  if( CustomSections_editor.debug_level > 2) { console.log("control_map:", control_map); console.log("control_type:" + control_type); }

        switch( control_type ){
          case "color":           // provides a non-rgba system color picker only in some browsers, better use "colorpicker"
          case "date":            // still unsupported my some major browsers, use "datepicker"
          case "datetime":        // deprecated
          case "datetime-local":  // widely unsupported, use "datetime-combo"
          case "email":
          case "number":
          case "month":
          case "password":
          case "range":
          case "search":
          case "tel":
          case "text":
          case "time":            // still unsupported my some major browsers, use "clockpicker"
          case "url":             // only supports absolute urls. use "link_field" if you want all types, target control or autocomplete + finder selection for local pages/files
          case "week":
            var use_control = 'input_field';
            break;

          default:
            var use_control = control_type;
            break;
        }
      }
      var control = gp_editor.getControl(use_control, control_map);
      gp_editor.ui.controls.append(control);

    }); // each section_object.values --end
  }; // gp_editor.buildEditorUI --end





  gp_editor.getControl = function(use_control, control_map){

    /* DEBUG level 3 */ if( CustomSections_editor.debug_level > 2) { console.log("use_control:" + use_control); console.log("control_map: ", control_map); }

    // 'serialize' attributes array to a ' a="b" x="y" ' string
    var attributes = '';
    var add_classes = '';
    if( $.isPlainObject(control_map['attributes']) ){ 
      $.each(control_map['attributes'], function(attribute_name, attribute_value){
        if( attribute_name == "id" ){ 
          attributes += (' data-control-id="' + attribute_value + '" ');
          return; // id is reserved!
        } 
        if( attribute_name == "class" ){ 
          add_classes += (' ' + attribute_value);
          return; 
        }
        attributes += (' ' + attribute_name + '="' + attribute_value + '" ');
      });
    }
    // replace original attributes property with string 
    control_map['attributes'] = attributes;
    control_map['add_classes'] = add_classes;

    if( typeof(gp_editor.controls[use_control]) == "function" ){
      // control is defined -> generate
      var control = gp_editor.controls[use_control](control_map);
    }else{
      // control is undefined -> render warning control dummy
      var control = $('<div class="editor-ctl-box editor-ctl-missing">'
        + '<label><span class="label-text"><i class="fa fa-warning"></i> Unknown control type <em>' + use_control + '</em></span></label>' 
        + '</div>');
    }

    // bind possibles events: we might axe this in future versions for unflexibility and the use of eval()?
    if( $.isPlainObject(control_map['on']) ){ 
      $.each(control_map['on'], function(event, handler_str){
        control.find("input, select, textarea")
          .on(event, eval('(' + handler_str + ')') );
      });
    }
    return control;
  }; // gp_editor.getControl --end




  /* ################################################ */
  /* #####                                      ##### */
  /* #####            C O N T R O L S           ##### */
  /* #####                                      ##### */
  /* ################################################ */

  gp_editor.controls = { 

    input_field : function(control_map){
      var item        = control_map['item'];
      var input_type  = control_map['control_type'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var control = $(
          '<div class="editor-ctl-box editor-ctl-input' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span> '
        +     '<input id="editor-ctl-' + item + '" type="' + input_type + '" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
        +   '</label>' 
        + '</div>'
      );
      return control;
    }, // input_field --end



    select : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var options = '';
      if( $.isPlainObject(control_map['options']) ){ 
        $.each(control_map['options'], function(option_value, option_text){
          var selected = (option_value == value ? ' selected="selected"' : '');
          options += ('<option value="' + option_value + '"' + selected + '>' + option_text + '</option>');
        });
      }else{
        options += '<option value="undefined">No options defined!</option>';
      }
      var control = $(
          '<div class="editor-ctl-box editor-ctl-select' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span> '
        +     '<select id="editor-ctl-' + item + '" name="values[' + item + ']"' + attributes + '>'
        +       options
        +     '</select>' 
        +   '</label>' 
        + '</div>'
      );
      return control;
    }, // select --end



    textarea : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var control = $(
          '<div class="editor-ctl-box editor-ctl-textarea' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span> '
        +     '<textarea id="editor-ctl-' + item + '" name="values[' + item + ']"' + attributes + '>' + value + '</textarea>'
        +   '</label>' 
        + '</div>'
      );
      return control;
    }, // textarea --end



    checkbox : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var checked = value == '1' ? ' checked="checked"' : '';
      var control = $(
          '<div class="editor-ctl-box editor-ctl-checkbox' + add_classes + '">'
        +   '<label>'
        +     '<input id="editor-ctl-' + item + '-checkbox" type="checkbox" name="values[' + item + ']" value="' + value + '"' + checked  + attributes + '/><span></span> '
        +     '<span class="label-text">' + control_map['label'] + '</span>'
        +     '<input id="editor-ctl-' + item + '" type="hidden" name="values[' + item + ']" value="' + value + '"/>'
        +   '</label>' 
        + '</div>'
      );
      control.find("input[type='checkbox']").on("change", function(){
        var v = this.checked ? '1' : '0';
        $("#editor-ctl-" + item).val(v);
      });
      return control;
    }, // checkbox --end



    radio_group : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var radio_group = '<div class="editor-ctl-box editor-ctl-radio-group' + add_classes + '" id="editor-ctl-' + item + '-radio-group">';
      radio_group +=  '<label><span class="label-text">' + control_map['label'] + '</span></label>';
      if( $.isPlainObject(control_map['radio-buttons']) ){ 
        $.each(control_map['radio-buttons'], function(radio_value, radio_label){
          var checked = radio_value == value ? ' checked="checked"' : '';
          radio_group +=  '<label>';
          radio_group +=    '<input type="radio" name="radio[' + item + ']" value="' + radio_value + '"' + checked + attributes + '/><span></span> ';
          radio_group +=    '<span class="label-text">' + radio_label + '</span>';
          radio_group +=  '</label>';
        });
      }else{
        radio_group += '<label><span class="label-text">No radio buttons defined!</span></label>';
      }
      radio_group += '<input id="editor-ctl-' + item + '" type="hidden" name="values[' + item + ']" value="' + value + '"/>';
      radio_group += '</div>';

      var control = $(radio_group);
      control.find("input[type='radio']").on("change click", function(){
        var v = $(this).closest('.editor-ctl-radio-group').find("input[type='radio']:checked").val();
        $("#editor-ctl-" + item).val(v);
      });
      return control;
    }, // radio_group --end



    finder_select : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var control = $(
          '<div class="editor-ctl-box editor-ctl-finder-select' + add_classes + '">'
        +   '<label>'
        +     '<button>' + control_map['label'] + '</button>'
        +     '<input id="editor-ctl-' + item + '" type="hidden" name="values[' + item + ']" value="' + value + '"/>'
        +   '</label>' 
        + '</div>'
      );
      control.find("button").on("click", function(){
        gp_editor.selectUsingFinder(gp_editor.setFile, "#editor-ctl-" + item);
      });
      return control;
    }, // finder_select --end



    link_field : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var checked = value['target'] == '_blank' ? ' checked="checked" ' : '';
      var control = $(
          '<div class="editor-ctl-box editor-ctl-link-field' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span> '
        +     '<input id="editor-ctl-' + item + '-url" type="text" name="values[' + item + '][url]" value="' + value['url'] + '"/>'
        +     '<button title="Select File"><i class="fa fa-file-o"></i></button>'
        +   '</label>' 
        +   '<label>' 
        +     '<input type="checkbox"' + checked + '/><span></span> <span class="label-text">open in new tab\/window</span>'
        +     '<input id="editor-ctl-' + item + '-target" type="hidden" name="values[' + item + '][target]" value="' + value['target'] + '"/>'
        +   '</label>' 
        + '</div>'
      );

      /* DEBUG level 3 */  if( CustomSections_editor.debug_level > 2) { control.find("#editor-ctl-" + item).on("change", function(){ console.log("link value = " + $(this).val() ); }); }

      control.find("button")
        .on('click', function(){
          var url_field = $(this).closest(".editor-ctl-box").find("input[type='text']");
          gp_editor.selectUsingFinder(gp_editor.setFile, url_field);
        });
      control.find("input[type='checkbox']")
        .on("change", function(){
          var target = $(this).prop("checked") ? "_blank" : "_self";
          $("#editor-ctl-" + item + "-target").val(target).trigger("change");
        })
      control.find("#editor-ctl-" + item + "-url")
        .on("keyup change paste", function(){
          var checkbox = $(this).closest(".editor-ctl-box").find("input[type='checkbox']");
          if( $(this).val().indexOf('://') != -1 ){
            checkbox.prop("checked", true).trigger("change");
          }else{
            checkbox.prop("checked", false).trigger("change");
          }
        })
        .autocomplete({
          source    : gptitles,
          appendTo  : "#gp_admin_html",
          delay     : 100, 
          minLength : 0,
          select    : function(event,ui){
                        if( ui.item ){
                          $(this).val(encodeURI(ui.item[1]));
                          $(this).trigger("change");
                          event.stopPropagation();
                          return false;
                        }
                      }
      }).data("ui-autocomplete")._renderItem = function(ul,item) {
        return $("<li></li>")
          .data("ui-autocomplete-item", item[1])
          .append('<a>' + $gp.htmlchars(item[0]) + '<span>' + $gp.htmlchars(item[1])+'</span></a>')
          .appendTo(ul);
      };
      return control;
    }, // link_field --end



    ck_editor : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

   	  var control = $(
				'<div class="editor-ctl-box editor-ctl-ckedit' + add_classes + '">'
			  +   '<label>'
			  +     '<button id="editor-btn-ckedit-'+ item +'">' + control_map['label'] + '</button>'
			  +     '<input id="editor-ctl-' + item + '" type="hidden" name="values[' + item + ']" />'
			  +   '</label>' 
			  + '</div>'
			);
		  control.find("#editor-ctl-"+ item).val(value);
		  control.find("#editor-btn-ckedit-"+ item).on("click", function(){
			gp_editor.CKfield(gp_editor.setFile, "editor-ctl-" + item, control_map['label']);
		  });
      return control;
    }, // ck_editor --end



    multi_image : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var multi_img_ctl = '<div class="editor-ctl-box editor-ctl-multi-img' + add_classes + '">';
      multi_img_ctl +=   '<label><span class="label-text">' + control_map['label'] + '</span></label>';
      multi_img_ctl +=   '<ul id="multi-img-list-' + item + '" class="multi-img-list cf">';
      $.each(value, function(i, img){ 
        multi_img_ctl +=    '<li style="background-image:url(\'' + img + '\');">';
        multi_img_ctl +=      '<div title="Remove Image" class="remove-img-btn"><i class="fa fa-times" ></i></div>';
        multi_img_ctl +=      '<input type="hidden" name="values[' + item + '][]" value="' + img + '"/>';
        multi_img_ctl +=    '</li>';
      });
      multi_img_ctl +=   '</ul>';
      multi_img_ctl +=   '<label>';
      multi_img_ctl +=     '<button id="editor-btn-multi-img-'+ item +'"><i class="fa fa-image"></i> Add Image</button>';
      multi_img_ctl +=   '</label>';
      multi_img_ctl += '</div>';
      var control = $(multi_img_ctl);
      control.find("#editor-btn-multi-img-" + item).on("click", function(){
        gp_editor.selectUsingFinder(gp_editor.addImage, item);
      });
      control.find(".remove-img-btn").on("click", gp_editor.removeImage);
      control.find(".multi-img-list").sortable();
      return control;
    },


    datepicker : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var control = $(
          '<div class="editor-ctl-box editor-ctl-datepicker' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span> '
        +     '<input id="editor-ctl-' + item + '" type="text" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
        +   '</label>' 
        + '</div>'
      );
      control.find("input").datepicker({
        dateFormat : 'yy-mm-dd',
        onSelect : function(){
          $(this).change();
        }
      });
      return control;
    }, // multi_image --end



    clockpicker : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var control = $(
          '<div class="editor-ctl-box editor-ctl-clockpicker' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span> '
        +     '<input id="editor-ctl-' + item + '" type="text" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
        +   '</label>' 
        + '</div>'
      );
      control.find("input").clockpicker({
        placement : 'bottom',
        align     : 'left',
        autoclose : true,
        'default' : 'now',
        afterDone : function(){
          $(this).trigger("change");
        }
      });
      return control;
    }, // clockpicker --end




    datetime_combo : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var datetime = value.split('T'); // datetime-combo uses 'Y-m-dTH:i:s' format like the HTML5 datetime-local type
      //console.log("value=" , value);
      //console.log("datetime=" , datetime);
      var date = datetime[0];
      var time_full = datetime[1].split(':');
      time_full.pop();
      var time = time_full.join(':'); // = hours:minutes, clockpicker doesn't support seconds
      var control = $(
          '<div class="editor-ctl-box editor-ctl-datetime-combo' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span></label>'
        +   '<label class="ctl-half-width">'
        +     '<input class="editor-ctl-date" id="editor-ctl-' + item + '-date" type="text" value="' + date + '"' + attributes + '/>'
        +   '</label>' 
        +   '<label class="ctl-half-width">'
        +     '<input class="editor-ctl-time" id="editor-ctl-' + item + '-time" type="text" value="' + time + '"' + attributes + '/>'
        +   '</label>' 
        +   '<input id="editor-ctl-' + item + '" type="hidden" name="values[' + item + ']" value="' + value + '"/>'
        + '</div>'
      );
      control.find('input#editor-ctl-' + item + '-date').datepicker({
        dateFormat : 'yy-mm-dd',
        onSelect : function(){
          $(this).change();
        }
      });
      control.find('input#editor-ctl-' + item + '-time').clockpicker({
        placement : 'bottom',
        align : 'right',
        autoclose : true,
        'default' : 'now',
        afterDone : function(){
          $(this).trigger("change");
        }
      });
      control.find('input#editor-ctl-' + item + '-date, input#editor-ctl-' + item + '-time').on("change", function(){
        var date_field = $(this).closest(".editor-ctl-box").find(".editor-ctl-date");
        var time_field = $(this).closest(".editor-ctl-box").find(".editor-ctl-time");
        var date = date_field.val().trim();
        var time = (time_field.val().trim() == "") ? '00:00' : time_field.val();
        var date_time = (date != "") ? date + 'T' + time + ':00' : "";
        $(this).val(date_time).trigger("change");
      });
      return control;
    }, // datetime_combo --end



    colorpicker : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var control = $(
          '<div class="editor-ctl-box editor-ctl-colorpicker' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span> '
        +     '<input id="editor-ctl-' + item + '" type="text" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
        +   '</label>' 
        + '</div>'
      );
      control.find("input").colorpicker({
        format : "rgba",
        align : "left"
      })
      .on('changeColor.colorpicker', function(e){
        $(this).trigger("change");
      });
      return control;
    }, // colorpicker --end
	
	bunch_control: function(control_map){
		var item        = control_map['item'];
		var value       = control_map['value'];
		var add_classes = control_map['add_classes'];
		var sub_controls= control_map['sub_controls'];
		
		//ordering values
		var new_val=[];
		if(value.bunch_control_order !== undefined && value.bunch_control_order !=="") {
			var order = value['bunch_control_order'].split(',');
			$.each(order,function(q,w){
				new_val.push(value[w]);
			})
		value=new_val;
		}
							
		var bunch_ctrl = '<div class="editor-ctl-box editor-ctl-bunch-ctr' + add_classes + '">';
			bunch_ctrl +=   '<label><span class="label-text">' + control_map['label'] + '</span></label>';
			//values render
			bunch_ctrl += '<div class="'+item+'_bunch_items_container">';
			
		$.each(value, function(i, bunch_item){
			if( $.isPlainObject(bunch_item )){ 			
				bunch_ctrl += '<div id="bunch-item-'+item+'-'+i+'" data-sort="'+i+'" class="bunch_item"><p>'+control_map['label']+i+'</p>';
						$.each(bunch_item, function(sub_item_name, sub_item_val){
						//	\''+JSON.stringify(dataObj).replace(/'/g, "\\'");+'\' // way to store json in data
						 var sub_control_data = JSON.stringify(sub_controls[sub_item_name]).replace(/'/g, "\\'");
						 bunch_ctrl +=   '<input data-item="'+item+i+sub_item_name+'-bunch_box" data-subname="'+sub_item_name+'" data-control=\''+sub_control_data+'\' type="hidden" name="values[' + item + ']['+i+']['+sub_item_name+']" value="' + escapeHtml(sub_item_val) + '"/>';
						});
				
				bunch_ctrl += '<div title="Edit" class="edit-bc-btn"><i class="fa fa-pencil"></i></div>';
				bunch_ctrl += '<div title="Remove" class="remove-bc-btn"><i class="fa fa-times"></i></div>';
				bunch_ctrl +='</div>';
			}
		  });
			bunch_ctrl +='</div>';
						
			//dummy bunch-control for adding
			bunch_ctrl +='<div id="dummy-'+item+'" class="bunch-ctr-dummy" data-bunchcount="">';
			$.each(sub_controls, function(sub_name, sub_map){ 
				var temp=JSON.stringify(sub_map).replace(/'/g, "\\'");
				bunch_ctrl += '<p data-item="'+item+sub_name+'-bunch_box" data-subname="'+sub_name+'" data-control=\''+temp+'\' ></p>';
			 })
			bunch_ctrl +='</div>';
			//
			//input for order
			bunch_ctrl += '<input type="hidden" id="sort_order" name="values[' + item + '][bunch_control_order]" val="'+value['bunch_control_order']+'"/>'
			
			bunch_ctrl +=   '<label>';
			bunch_ctrl +=     '<button id="editor-btn-bunch-ctr-'+ item +'"><i class="fa fa-plus"></i> Add</button>';
			bunch_ctrl +=   '</label>';
			bunch_ctrl += '</div>';
	var control = $(bunch_ctrl);
	
	//set count
	var bunchcount = control.find(".bunch_item").map(function(){return $(this).data("sort");}).get();
	bunchcount = Math.max.apply( Math, bunchcount );
	control.find(".bunch-ctr-dummy").data("bunchcount", bunchcount);
	
	control.find("#editor-btn-bunch-ctr-" + item).on("click", function(){
				var subcontrols={};
				control.find(".bunch-ctr-dummy p").each(function(){
					var sn= $(this).data('item');
					var temp_control =$(this).data('control');
					temp_control['value'] = "";
					temp_control['item'] = $(this).data('item');
					temp_control['attributes'] = {"class":"sub_control"};
					temp_control['bunch_name'] =item;
					temp_control['bunch_label'] =control_map['label'];
					temp_control['bunch_number'] =control.find(".bunch-ctr-dummy").data('bunchcount')+1;
					temp_control['sub_name'] =$(this).data('subname');
					subcontrols[sn] = temp_control; 
				})
			gp_editor.editBunchControl(true,subcontrols);//add
      });

	 control.find(".edit-bc-btn").on("click", function(){	
		var subcontrols={};
		$(this).parent().find("input").each(function(){
			var sn= $(this).data('subname');
			var temp_control = $(this).data('control');
			temp_control['value'] = $(this).val();
			temp_control['item'] = $(this).data('item');
			temp_control['attributes'] = {"class":"sub_control"};
			temp_control['bunch_label'] =control_map['label'];
			temp_control['bunch_number'] =$(this).parent().data('sort');
			subcontrols[sn] = temp_control;
		})
				
       gp_editor.editBunchControl('',subcontrols);
      });
	 
	 control.find(".remove-bc-btn").on("click", function(){
		gp_editor.deleteBunchControl($(this));
	 });
	  
	control.find("."+item+"_bunch_items_container").sortable({
        update  : function(event, ui){
                 var current_list = $(event.target);
				 gp_editor.saveBunchControlsOrder(current_list);
                  }
    });
	
	return control;	
	}// bunch_control --end

  }; // gp_editor.controls --end
 
 


  /* ################################################ */
  /* #####                                      ##### */
  /* #####         I N I T   E D I T O R        ##### */
  /* #####                                      ##### */
  /* ################################################ */

  /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 1) { console.log('gp_editor extensions ' , CustomSections_editor.extensions); }

  // extensions(extra_controls)
  $.each(CustomSections_editor.extensions, function(i, obj){
    $.extend(true, gp_editor, obj);
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 1) { console.log('gp_editor extension ' + i + ' loaded'); }
  });

  gp_editor.buildEditorUI();
  gp_editor.setResponse();
  gp_editor.resetCache();
  loaded();

} /* gp_init_inline_edit --end */

