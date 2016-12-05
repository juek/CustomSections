/*
###################################################################################
Universal Editor Javascript for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-11-28
Version 1.0b1
###################################################################################
*/


function gp_init_inline_edit(area_id, section_object){

  /* DEBUG level 3 */
  if( CustomSections_editor.debug_level > 2) {
    console.log("section_object = ", section_object);
  }
 
  $.each(CustomSections_editor.css, function(i, css_file){
    $gp.LoadStyle( css_file, true ); // true for (boolean)alreadyprefixed
  });

  gp_editing.editor_tools();

  gp_editor = {
    section_object    : section_object,
    edit_section      : gp_editing.get_edit_area(area_id),
    save_path         : gp_editing.get_path(area_id),
    cacheValue        : '',
    destroy           : function(){},
    getValues         : function(){},
    SaveData          : function(){},
    isDirty           : false,
    checkDirty        : function(){},
    resetDirty        : function(){},
    intervalSpeed     : function(){},
    selectUsingFinder : function(){},
    setImage          : function(){},
    updateSection     : function(){},
    CKfield           : function(){},
    updateCKfield     : function(){},
    destroyCK         : function(){},
    addImage          : function(){},
    isImage           : function(){},
    ui                : {}
  }; 



  gp_editor.getValues = function(){
    var values = gp_editor.ui.controls
      .find("input:not(.editor-ctl-no-submit, [type='checkbox'], [type='radio']), select, textarea")
      .serialize();
    return values;
  };


  gp_editor.SaveData = function(){
    var values = gp_editor.getValues();
    var content = encodeURIComponent( gp_editor.edit_section.html() );
    return 'gpcontent=' + content + '&' + values;
  };


  gp_editor.checkDirty = function(){
    var values = gp_editor.getValues();
    /* DEBUG level 3 */ if( CustomSections_editor.debug_level > 2 ){ console.log("getValues = " + values);  console.log("cacheValue = " + gp_editor.cacheValue); }
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 1 ){ console.log("checkDirty returns " + (gp_editor.isDirty ? "true" : "false") ); }
    if( values != gp_editor.cacheValue ){
      gp_editor.updateSection(); // will now also set gp_editor.isDirty = true and call gp_editor.resetCache() after section update finished
    }
    return gp_editor.isDirty;
  };


  gp_editor.resetDirty = function(){
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 1 ){ console.log("gp_editor.resetDirty called"); }
    gp_editor.isDirty = false;
  };


  gp_editor.resetCache = function(){
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 1 ){ console.log("gp_editor.resetCache called"); };
    gp_editor.cacheValue = gp_editor.getValues();
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
    gp_editor.ui.controls.find(input_selector).val(fileUrl).trigger("change");
  };


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
    loading();
    var href = jPrep(window.location.href) 
      + '&cmd=save_custom_section' 
      + '&type=' + section_object.type
      + '&values=' + gp_editor.SaveData();
    $.getJSON(href, ajaxResponse);
  };


  gp_editor.getControl = function(input_type, control_map, item, value){

    /* DEBUG level 3 */
    if( CustomSections_editor.debug_level > 2) {
      console.log("input_type:" + input_type);
      console.log("control_map: ", control_map);
      console.log("value: " + value);
    }

    var attributes = '';
    var type_attr = control_map['control_type'];
    if( $.isPlainObject(control_map['attributes']) ){ 
      $.each(control_map['attributes'], function(attribute_name, attribute_value){
        attributes += (' ' + attribute_name + '="' + attribute_value + '"');
      });
    }

    switch( input_type ){

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


      case "link-field":
        var checked = value['target'] == '_blank' ? ' checked="checked" ' : '';
        var control = $(
            '<div class="editor-ctl-box editor-ctl-link-field">'
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
        /* DEBUG level 3 */ 
        if( CustomSections_editor.debug_level > 2) {
          control.find("#editor-ctl-" + item).on("change", function(){ 
            console.log("link value = " + $(this).val() ); 
          });
        }
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
        break;


      case "ck_editor":
        var control = $(
              '<div class="editor-ctl-box editor-ctl-ckedit">'
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
        break;


      case "multi-image":
        var multi_img_ctl = '<div class="editor-ctl-box editor-ctl-multi-img">';
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
        break;



      case "datepicker":
        var control = $(
            '<div class="editor-ctl-box editor-ctl-datepicker">'
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
        break;


      case "clockpicker":
        var control = $(
            '<div class="editor-ctl-box editor-ctl-clockpicker">'
          +   '<label><span class="label-text">' + control_map['label'] + '</span> '
          +     '<input id="editor-ctl-' + item + '" type="text" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
          +   '</label>' 
          + '</div>'
        );
        control.find("input").clockpicker({
          placement : 'bottom',
          align : 'left',
          autoclose : true,
          'default' : 'now',
          afterDone : function(){
            $(this).trigger("change");
          }
        });
        break;

      case "datetime-combo":
        var datetime = value.split('T'); // datetime-combo uses ISO 8601 format 'Y-m-dTH:i:s' omitting '+timezone-offset', same does HTML5 datetime-local input type
        //console.log("value=" , value);
        //console.log("datetime=" , datetime);
        var date = datetime[0];
        var time_full = datetime[1].split(':');
        time_full.pop();
        var time = time_full.join(':'); // = hours:minutes, clockpicker doesn't support seconds input
        var control = $(
            '<div class="editor-ctl-box editor-ctl-datetime-combo">'
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
          var date_time = (date == "") ? date + 'T' + time + ':00' : "";
          $(this).val(date_time).trigger("change");
        });
        break;


      case "clockpicker":
        var control = $(
            '<div class="editor-ctl-box editor-ctl-clockpicker">'
          +   '<label><span class="label-text">' + control_map['label'] + '</span> '
          +     '<input id="editor-ctl-' + item + '" type="text" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
          +   '</label>' 
          + '</div>'
        );
        control.find("input").clockpicker({
          placement : 'bottom',
          align : 'left',
          autoclose : true,
          'default' : 'now',
          afterDone : function(){
            $(this).trigger("change");
          }
        });
        break;




      case "colorpicker":
        var control = $(
            '<div class="editor-ctl-box editor-ctl-colorpicker">'
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
        break;

    }

    if( $.isPlainObject(control_map['on']) ){ 
      $.each(control_map['on'], function(event, handler_str){
        control.find("input, select, textarea").on(event, eval('(' + handler_str + ')') );
      });
    }
    return control;
  }; // gp_editor.getControl --end



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
  };



  gp_editor.removeImage = function(e){
    $(this).closest("li").remove();
    // possible re-inits here
  };



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
  }



  // define ajaxResponse callback
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



  // ##### build the editor ui #####

  gp_editor.ui.controls = $('<div id="option_area"></div>').prependTo('#ckeditor_controls');

  $.each(section_object.values, function(item, value){
    if( item in CustomSections_editor.controls ){
      var control_map = CustomSections_editor.controls[item];
      var control_type = control_map['control_type'];

      /* DEBUG level 3 */
      if( CustomSections_editor.debug_level > 2) {
        console.log("control_map:", control_map);
        console.log("control_type:" + control_type);
      }

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

        case "link-field":
          gp_editor.ui.controls.append( gp_editor.getControl("link-field", control_map, item, value) );
          break;  

        case "ck_editor":
          gp_editor.ui.controls.append( gp_editor.getControl("ck_editor", control_map, item, value) );
          break;

        case "datepicker":
          gp_editor.ui.controls.append( gp_editor.getControl("datepicker", control_map, item, value) );
          break;

        case "clockpicker":
          gp_editor.ui.controls.append( gp_editor.getControl("clockpicker", control_map, item, value) );
          break;

        case "datetime-combo":
          gp_editor.ui.controls.append( gp_editor.getControl("datetime-combo", control_map, item, value) );
          break;

        case "colorpicker":
          gp_editor.ui.controls.append( gp_editor.getControl("colorpicker", control_map, item, value) );
          break;

        case "multi-image":
          gp_editor.ui.controls.append( gp_editor.getControl("multi-image", control_map, item, value) );
          break;

      }
    }
  }); // each section_object.values --end
 
  gp_editor.cacheValue = gp_editor.getValues();

  loaded();

}




