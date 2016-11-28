/*
###################################################################################
Universal Editor Javascript for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-11-28
Version 1.0b1
###################################################################################
*/


function gp_init_inline_edit(area_id, section_object){

  console.log("section_object = ", section_object);

  $gp.LoadStyle( CustomSections_editor.editor_css, true ); // true for (boolean)alreadyprefixed
  gp_editing.editor_tools();

  gp_editor = {
    edit_section      : gp_editing.get_edit_area(area_id),
    save_path         : gp_editing.get_path(area_id),
    cacheValue        : '',
    destroy           : function(){},
    SaveData          : function(){},
    checkDirty        : function(){},
    resetDirty        : function(){},
    intervalSpeed     : function(){},
    selectUsingFinder : function(){},
    setImage          : function(){},
    updateSection     : function(){},
    CKfield			  : function(){},
    updateCKfield	  : function(){},
    destroyCK		  : function(){},
    ui                : {}
  
  }; 


  gp_editor.SaveData = function(){
    var values = gp_editor.ui.controls.find("input:not([type='checkbox'],[type='radio']),select,textarea").serialize();
    var content = encodeURIComponent( gp_editor.edit_section.html() );
    return 'gpcontent=' + content + '&' + values;
  };


  gp_editor.checkDirty = function(){
    //console.log("SD=" + gp_editor.SaveData());
    //console.log("cV=" + gp_editor.cacheValue);
    var curr_val = gp_editor.SaveData();
    if( curr_val != gp_editor.cacheValue ){
      gp_editor.updateSection();
      return true;
    }
    return false;
  };


  gp_editor.resetDirty = function(){
    gp_editor.cacheValue = gp_editor.SaveData();
  };


  gp_editor.selectUsingFinder = function(callback_fn, input_selector){
    gp_editor.FinderSelect = function(fileUrl){ 
      if (fileUrl != "") {
        callback_fn(fileUrl, input_selector);
      }
      return true;
    };
    var finderPopUp = window.open(gpFinderUrl, 'gpFinder', 'menubar=no,width=960,height=450');
    if( window.focus ){ 
      finderPopUp.focus(); 
    }
  }; 


  gp_editor.setFile = function(fileUrl, input_selector){
    gp_editor.ui.controls.find(input_selector).val(fileUrl);
  };

  gp_editor.CKfield = function(callback_fn, input_selector, label) {
    var content = gp_editor.ui.controls.find("#"+input_selector).val();//.html();
	var boxHtml = '<div class="inline_box">'
    + '<h3>'+label+'</h3>'
    + '<textarea id="ck_field" name="ck_field" data-inp-selector="'+input_selector+'" cols="50" rows="3">'+$gp.htmlchars(content)+'</textarea>'
    + '<p><input class="gpsubmit" type="submit" name="" onclick="gp_editor.updateCKfield()" value="'+gplang.up+'" /> '
    + '<input class="gpcancel gp_admin_box_close" data-cmd="admin_box_close" onclick="gp_editor.destroyCK()" type="button" name="" value="'+gplang.ca+'" /></p>'
    + '</div>';
    $gp.AdminBoxC(boxHtml);
    CKEDITOR.config.baseFloatZIndex = 12000;
    CKEDITOR
      .replace("ck_field",CS_ckconfig);
  
  }; 
  
  gp_editor.destroyCK = function() {
    CKEDITOR.instances['ck_field'].destroy();
  };
	
  gp_editor.updateCKfield = function() {
	gp_editor.destroyCK();
	var caption = $("#ck_field").val();
	var input_selector = $("#ck_field").attr("data-inp-selector")
	gp_editor.ui.controls.find("#"+input_selector).val(caption);
	$gp.CloseAdminBox();

  };		
  gp_editor.updateSection = function(){
    var href = jPrep(window.location.href) 
      + '&cmd=save_custom_section' 
      + '&type=' + section_object.type
      + '&values=' + gp_editor.SaveData();
    $.getJSON(href, ajaxResponse);
  };


  gp_editor.getControl = function(input_type, control_map, item, value){
    //console.log("input_type:" + input_type);
    //console.log("control_map: ", control_map);
    //console.log("value: " + value);
    var attributes = '';
    var type_attr = control_map['control_type'];
    if( $.isPlainObject(control_map['attributes']) ){ 
      $.each(control_map['attributes'], function(attribute_name, attribute_value){
        attributes += (' ' + attribute_name + '="' + attribute_value + '"');
      });
    }

    switch( input_type ){

      /*
        case "color-picker":
        var control = $(
            '<div class="editor-ctl-box editor-ctl-input">'
          +   '<label><span class="label-text">' + control_map['label'] + '</span> '
          +     '<input id="editor-ctl-' + item + '" type="' + type_attr + '" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
          +   '</label>' 
          + '</div>'
        );
        control.find("input").colorpicker({
          format : "hex",
          align : "left"
        })
        .on('changeColor.colorpicker', function(e){
          $(this).trigger("change");
        });
        break;
      */


      case "input-field":
        var control = $(
            '<div class="editor-ctl-box editor-ctl-input">'
          +   '<label><span class="label-text">' + control_map['label'] + '</span> '
          +     '<input id="editor-ctl-' + item + '" type="' + type_attr + '" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
          +   '</label>' 
          + '</div>'
        );
        break;

      case "select":
        var options = '';
        if( $.isPlainObject(control_map['options']) ){ 
          $.each(control_map['options'], function(option_value, option_text){
            var selected = (option_value == value ? ' selected="selected"' : '');
            options += ('<option value="' + option_value + '"' + selected + '>' + option_text + '</option>');
          });
        }else{
          options += '<option value="">No options defined!</option>';
        }
        var control = $(
            '<div class="editor-ctl-box editor-ctl-select">'
          +   '<label><span class="label-text">' + control_map['label'] + '</span> '
          +     '<select id="editor-ctl-' + item + '" name="values[' + item + ']"' + attributes + '>'
          +       options
          +     '</select>' 
          +   '</label>' 
          + '</div>'
        );
        break;

      case "textarea":
        var control = $(
            '<div class="editor-ctl-box editor-ctl-textarea">'
          +   '<label><span class="label-text">' + control_map['label'] + '</span> '
          +     '<textarea id="editor-ctl-' + item + '" name="values[' + item + ']"' + attributes + '>' + value + '</textarea>'
          +   '</label>' 
          + '</div>'
        );
        break;

      case "checkbox":
        var checked = value ? ' checked="checked"' : '';
        var control = $(
            '<div class="editor-ctl-box editor-ctl-checkbox">'
          +   '<label>'
          +     '<input id="editor-ctl-' + item + '-checkbox" type="checkbox" name="values[' + item + ']" value="' + value + '"' + checked  + attributes + '/><span></span> '
          +     '<span class="label-text">' + control_map['label'] + '</span>'
          +     '<input id="editor-ctl-' + item + '" type="hidden" name="values[' + item + ']" value="' + value + '"/>'
          +   '</label>' 
          + '</div>'
        );
        control.find("input[type='checkbox']").on("change", function(){
          var v = this.checked ? $(this).val() : '0';
          $("#editor-ctl-" + item).val(v);
        });
        break;

      case "radio-group":
        var radio_group = '<div class="editor-ctl-box editor-ctl-radio-group" id="editor-ctl-' + item + '-radio-group">';
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
        break;

      case "finder-select":
        var control = $(
            '<div class="editor-ctl-box editor-ctl-finder-select">'
          +   '<label>'
          +     '<button>' + control_map['label'] + '</button>'
          +     '<input id="editor-ctl-' + item + '" type="hidden" name="values[' + item + ']" value="' + value + '"/>'
          +   '</label>' 
          + '</div>'
        );
        control.find("button").on("click", function(){
          gp_editor.selectUsingFinder(gp_editor.setFile, "#editor-ctl-" + item);
        });
        break;
		
		case "ck_editor":
		 var control = $(
            '<div class="editor-ctl-box editor-ctl-ckedit">'
          +   '<label>'
          +     '<button id="editor-btn-ckedit-'+ item +'">' + control_map['label'] + '</button>'
          +     '<input id="editor-ctl-ckedit' + item + '" type="hidden" name="values[' + item + ']" value="' + value + '"/>'
          +   '</label>' 
          + '</div>'
        );
        control.find("#editor-btn-ckedit-"+ item).on("click", function(){
			gp_editor.CKfield(gp_editor.setFile, "editor-ctl-ckedit" + item, control_map['label']);
		});
		break;
		
    }

    if( $.isPlainObject(control_map['on']) ){ 
      $.each(control_map['on'], function(event, handler_str){
        control.find("input, select, textarea").on(event, eval('(' + handler_str + ')') );
      });
    }
    return control;
  }; // gp_editor.getControl --end


  // define ajaxResponse callback
  $gp.response.updateContent = function(arg){
    gp_editor.edit_section.html(arg.CONTENT);
  };


  // ##### build the editor ui #####

  gp_editor.ui.controls = $('<div id="option_area"></div>').prependTo('#ckeditor_controls');

  $.each(section_object.values, function(item, value){
    if( item in CustomSections_editor.controls ){
      var control_map = CustomSections_editor.controls[item];
      var control_type = control_map['control_type'];
      //console.log("control_map:", control_map);
      //console.log("control_type:" + control_type);
      switch( control_type ){
        case "color": // provides a system color picker as of Edge 14, Firefox 29, Chrome 20, Safari 10, Opera 17 and some mobile browsers
        case "date":
        case "datetime":
        case "datetime-local":
        case "email":
        case "number":
        case "month":
        case "password":
        case "range":
        case "search":
        case "tel":
        case "text":
        case "time":
        case "url":
        case "week":
          gp_editor.ui.controls.append( gp_editor.getControl('input-field', control_map, item, value) );
          break;

        case "select":
          gp_editor.ui.controls.append( gp_editor.getControl('select', control_map, item, value) );
          break;

        case "textarea":
          gp_editor.ui.controls.append( gp_editor.getControl('textarea', control_map, item, value) );
          break;

        case "checkbox":
          gp_editor.ui.controls.append( gp_editor.getControl('checkbox', control_map, item, value) );
          break;

        case "radio-group":
          gp_editor.ui.controls.append( gp_editor.getControl("radio-group", control_map, item, value) );
          break;

        case "finder-select":
          gp_editor.ui.controls.append( gp_editor.getControl("finder-select", control_map, item, value) );
          break;  
		
		case "ck_editor":
          gp_editor.ui.controls.append( gp_editor.getControl("ck_editor", control_map, item, value) );
          break;

      }
    }
  }); // each section_object.values --end
 
  loaded();

}




