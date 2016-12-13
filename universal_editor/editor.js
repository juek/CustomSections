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
    $.each(values_serialized, function(i,v){
      data[v['name']] = v['value'];
    });
    // console.log("data = ", data);
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
    gp_editor.ui.controls.find(input_selector).val(fileUrl).trigger("change");
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

