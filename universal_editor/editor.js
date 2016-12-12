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
    section_object        : section_object,
    edit_section          : gp_editing.get_edit_area(area_id),
    save_path             : gp_editing.get_path(area_id),
    cacheValue            : '',
    destroy               : function(){},
    getFormElements             : function(){},
    SaveData              : function(){},
    isDirty               : false,
    checkDirty            : function(){},
    resetDirty            : function(){},
    intervalSpeed         : function(){},
    selectUsingFinder     : function(){},
    setImage              : function(){},
    updateSection         : function(){},
    CKfield               : function(){},
    updateCKfield         : function(){},
    destroyCK             : function(){},
    addImage              : function(){},
    isImage               : function(){},

    editMultiDateItem     : function(){},
    updateMultiDateItem   : function(){},
    deleteMultiDateItem   : function(){},
    sortMultiDateItems    : function(){},
    reIndexMultiDateItems : function(){},

    ui                : {}
  }; 



  gp_editor.getFormElements = function(){
    var form_elements = gp_editor.ui.controls
      .find("input:not(.editor-ctl-no-submit, [type='checkbox'], [type='radio']), select, textarea");
    return form_elements;
  };


  gp_editor.SaveData = function(){
    var values = gp_editor.getFormElements().serialize();
    var content = encodeURIComponent( gp_editor.edit_section.html() );
    return 'gpcontent=' + content + '&' + values;
  };



  gp_editor.updateSection = function(){
    loading();
    /*
    var href = jPrep(window.location.href) 
      + '&cmd=save_custom_section' 
      + '&type=' + section_object.type
      + '&values=' + gp_editor.SaveData();
    $.getJSON(href, ajaxResponse);
    */
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
  };
  



  gp_editor.checkDirty = function(){
    var values = gp_editor.getFormElements().serialize();
    /* DEBUG level 2 */ if( CustomSections_editor.debug_level > 2 ){ console.log("getFormElements = " + values);  console.log("cacheValue = " + gp_editor.cacheValue); }
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
    gp_editor.cacheValue = gp_editor.getFormElements().serialize();
  };


  gp_editor.selectUsingFinder = function(callback_fn, input_selector){
    gp_editor.FinderSelect = function(fileUrl){ 
      if (fileUrl != "") {
        $.isFunction(callback_fn) ?  callback_fn(fileUrl, input_selector) : false;
      }
      setTimeout(function(){
      }, 150);
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


  gp_editor.editMultiDateItem = function(e){
    var clicked_element = $(e.target);
    var current_list = clicked_element.closest(".editor-ctl-multi-date").find(".multi-date-list");
    // set selected option data attribute for cloning
    current_list.find("select").each( function(){
      $(this).attr("data-selected", $(this).val());
    });
    if( $(clicked_element).is("button") ){
      var item_index = current_list.find("li").length + 1; // Add Date button was clicked => new item (item_index = li count +1 )
      var date_li_clone = current_list.find("li").last().clone(); // clone the last list item
      var box_heading = '<i class="fa fa-calendar-plus-o"></i> Add Date';
      var save_button_label = gplang.Save;
    }else{
      var item_index = clicked_element.closest("li").index(); // Edit Date button was clicked => item_index = index of parent li
      var date_li_clone = clicked_element.closest("li").clone(); // clone the clicked list item
      var box_heading = '<i class="fa fa-pencil"></i> Edit Date';
      var save_button_label = gplang.up;
    }
    var boxHtml = '<div class="inline_box" data-list-id="' + current_list.attr("id") + '">'
    +   '<h3>' + box_heading + '</h3>'
    +   '<div id="admin_box-date-values" data-item-index="' + item_index + '">' + date_li_clone.find("div.multi-date-values").html() + '</div>'
    +   '<p><input class="gpsubmit" type="submit" name="" onclick="gp_editor.updateMultiDateItem()" value="' + save_button_label + '" /> '
    +     '<input class="gpcancel gp_admin_box_close" data-cmd="admin_box_close" type="button" name="" value="' + gplang.ca + '" /></p>'
    + '</div>';
    $gp.AdminBoxC(boxHtml);
    var adminBox = $("#gp_admin_boxc");
    adminBox.find('input.multi-date-start-time, input.multi-date-end-day, input.multi-date-end-time')
      .after('<button class="gpcancel multi-date-unset-value">unset</button>');
    adminBox.find("button.multi-date-unset-value").on("click", function(){ 
      $(this).prev().val(""); 
    });
    adminBox.find('input.multi-date-day').datepicker({
      dateFormat : 'yy-mm-dd',
      onSelect : function(){
        $(this).change();
      }
    });
    adminBox.find('input.multi-date-time').clockpicker({
      placement : 'bottom',
      align : 'left',
      autoclose : true,
      'default' : 'now',
      afterDone : function(){
        $(this).trigger("change");
      }
    });
    adminBox.find('input.multi-date-start-day').focus().select(); // we need to re-focus for datepicker. $gp.AdminBoxC() already set the focus on the 1st input before datepicker was initialized.
  }; 


  gp_editor.reIndexMultiDateItems = function(list, unset_sort_button){
    // console.log("gp_editor.reIndexMultiDateItems called with #", list.attr("id"));
    var new_index = 0;
    list.sortable("destroy");
    var new_list = list.clone(true);
    new_list.find("li").each( function(){
      $(this).find("input, select, textarea").each( function(){
        var current_name = $(this).attr("name");
        // console.log('reIndex -> current_name = ' + current_name);
        if( current_name ){
          var name_arr = current_name.split('][');  // values[item][index][element]
          name_arr[1] = new_index;
          new_name = name_arr.join('][');
          $(this).attr("name", new_name);
          // console.log('reIndex -> new name = ' + new_name);
        }
      });
      new_index++;
    });
    // $list.replaceWith(new_list).sortable("refresh");
    list.replaceWith(new_list)
    new_list.sortable({
      update  : function(event, ui){
                  //console.log("event ", event);
                  //console.log("ui ", ui);
                  var current_list = $(event.target);
                  gp_editor.reIndexMultiDateItems(current_list, true);
                }
    });
    if( unset_sort_button ){
      var sort_button = new_list.closest(".editor-ctl-box").find("a.multi-date-sort");
      sort_button
        .attr("title", "Sort Dates Ascending")
        .removeClass("multi-date-sort-asc multi-date-sort-desc");
    }
  };



  gp_editor.sortMultiDateItems = function(e){
    var sort_button = $(e.target);
    var sort_list = sort_button.closest(".editor-ctl-box").find("ul.multi-date-list");
    if( sort_button.hasClass('multi-date-sort-asc') ){
      var sort_dir = '-1';
      sort_button
        .attr("title", "Sort Dates Ascending")
        .removeClass('multi-date-sort-asc').addClass('multi-date-sort-desc');
    }else{
      var sort_dir = '1';
      sort_button
        .attr("title", "Sort Dates Descending")
        .removeClass('multi-date-sort-desc').addClass('multi-date-sort-asc');
    }
    $(sort_list).find("li")
      .sort( function(a, b){
        return ( $(b).attr("data-start-date") < $(a).attr("data-start-date") ? 1 * sort_dir : -1 * sort_dir );
      })
      .appendTo(sort_list);
  };



  gp_editor.deleteMultiDateItem = function(e){
    var clicked_element = $(e.target);
    if( confirm("Really delete this date?") ){
      var current_list = clicked_element.closest("ul");
      clicked_element.closest("li").remove();
      gp_editor.reIndexMultiDateItems(current_list, false);
    }
  };


  gp_editor.updateMultiDateItem = function(){
    var current_list = $("#" + $("#gp_admin_boxc .inline_box").attr("data-list-id") );
    if( !current_list.length ){
      alert('Error: Editor list $(#' + $("#gp_admin_boxc .inline_box").attr("data-list-id") + ') was not found!');
      $gp.CloseAdminBox();
      return false;
    }
    var monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Novr", "Dec"];
    var item_index = $("#gp_admin_boxc div#admin_box-date-values").attr("data-item-index");
    // clean up
    $('div#admin_box-date-values input.multi-date-day').removeAttr("id").datepicker("destroy");
    $('div#admin_box-date-values input.multi-date-time').clockpicker("remove");
    $("div#admin_box-date-values button.multi-date-unset-value").remove();
    // calculate new Unix Times for start_date and end_date
    var start_day_val = $("#gp_admin_boxc input.multi-date-start-day").val().trim();
    var start_time_val = $("#gp_admin_boxc input.multi-date-start-time").val().trim();
    var end_day_val = $("#gp_admin_boxc input.multi-date-end-day").val().trim();
    var end_time_val = $("#gp_admin_boxc input.multi-date-end-time").val().trim();
    if( start_day_val == "" ){
      alert("At least a start day must be defined!");
      $("#gp_admin_boxc input.multi-date-start-day").focus();
      return false;
    }
    var start_date = Math.round( new Date(start_day_val + (start_time_val != "" ? ('T' + start_time_val + ':00') : '' )).getTime() / 1000 );
    var end_date = 
      end_day_val != "" 
        ? Math.round( new Date(end_day_val + (end_time_val != "" ? ('T' + end_time_val + ':00') : '' )).getTime() / 1000 ) // Unix Time is seconds
        : (end_time_val != "" 
            ? Math.round( new Date(start_day_val + 'T' + end_time_val + ':00').getTime() / 1000 ) // Unix Time is seconds
            : start_date
          );
    $("div#admin_box-date-values input.multi-date-start-date").val(start_date);
    $("div#admin_box-date-values input.multi-date-end-date").val(end_date);
    var startDateObj = new Date(start_date*1000); // JS Date() needs miliseconds
    // jQ cloning form elements with JS set values is such a pain in the a**! >:-(
    $("div#admin_box-date-values input").each( function(){
      $(this).attr("value",  $(this).val() );
    });
    $("div#admin_box-date-values textarea").each( function(){
      $(this).text( $(this).val() );
    });
    $("div#admin_box-date-values select").each( function(){
      select_val = $(this).val();
      $(this).find("option").each( function() {
        if( $(this).attr("value") == select_val ){
          $(this).attr("selected", "selected");
        }else{
          $(this).removeAttr("selected");
        }
      })
    });
    var new_values = $("div#admin_box-date-values").clone(true);
    new_values.removeAttr("id").addClass("multi-date-values");
    var date_li = $(
        '<li data-start-date="' + start_date +  '" data-end-date="' + end_date +  '">' 
      +   '<div class="multi-date-day">' + startDateObj.getDate() + '</div>'
      +   '<div class="multi-date-month">' + monthAbbr[startDateObj.getMonth()] + '</div>'
      +   '<div title="Edit Date" class="edit-date-btn"><i class="fa fa-pencil" ></i></div>'
      +   '<div title="Remove Date" class="remove-date-btn"><i class="fa fa-times" ></i></div>'
      + '</li>'
    );
    date_li.append(new_values)
    // bind button event handlers
    date_li.find(".edit-date-btn").on("click", gp_editor.editMultiDateItem);
    date_li.find(".remove-date-btn").on("click", gp_editor.deleteMultiDateItem);
    date_li.addClass("multi-date-updated-item").on("mouseleave", function(){
      $(this).removeClass("multi-date-updated-item");
    });
    if( item_index >= current_list.find("li").length ){
      // li with item_index doesn't exist, it's a new one -> append it
      current_list.append(date_li);
      gp_editor.reIndexMultiDateItems(current_list, true);
    }else{
      // li with item_index exists -> replace it
      current_list.find("li").eq(item_index).replaceWith(date_li);
    }
    // TODO: maybe sort the list chronologically?
    $gp.CloseAdminBox();
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
        var checked = value == '1' ? ' checked="checked"' : '';
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
          var v = this.checked ? '1' : '0';
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
        var datetime = value.split('T'); // datetime-combo uses 'Y-m-dTH:i:s' format like the HTML5 datetime-local type
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
          var date_time = (date != "") ? date + 'T' + time + ':00' : "";
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


      case "multi-date":
        var monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Novr", "Dec"];

        var multi_date_ctl = '<div class="editor-ctl-box editor-ctl-multi-date">';
        multi_date_ctl +=   '<label><span class="label-text">' + control_map['label'] + '</span><a title="Sort Dates Ascending" class="multi-date-sort"></a></label>';
        multi_date_ctl +=   '<ul id="multi-date-list-' + item + '" class="multi-date-list cf">';
        $.each(value, function(i, date_vals){
          // calculate Unix Times for date_vals['start_date'] and date_vals['start_date'] if not set
          if( typeof(date_vals['start_date']) == "undefined" || date_vals['start_date'] == "" ){
            date_vals['start_date'] = 
            Math.round( new Date(date_vals['start_day'] + (typeof(date_vals['start_time']) != "undefined" && date_vals['start_time'] != "" ? ('T' + date_vals['start_time'] + ':00') : '' )).getTime() / 1000 );
          }
          if( typeof(date_vals['end_date']) == "undefined" || date_vals['end_date'] == "" ){
            date_vals['end_date'] = 
              typeof(date_vals['end_day']) != "undefined" && date_vals['end_day'] != "" 
                ? Math.round( new Date(date_vals['end_day'] + (typeof(date_vals['end_time']) != "undefined" && date_vals['end_time'] != "" ? ('T' + date_vals['end_time'] + ':00') : '' )).getTime() / 1000 )
                : ( typeof(date_vals['end_time']) != "undefined" && date_vals['end_time'] != "" 
                    ? Math.round( new Date(date_vals['start_day'] + 'T' + date_vals['end_time'] + ':00' ).getTime() / 1000 )
                    : date_vals['start_date'] // if end_day is empty, end_date=start_date
                  );
          }
          var startDateObj = new Date(date_vals['start_date']*1000);
          multi_date_ctl +=    '<li data-start-date="' + date_vals['start_date'] + '" data-end-date="' + date_vals['end_date'] + '" >';
          multi_date_ctl +=      '<div class="multi-date-day">' + startDateObj.getDate() + '</div>';
          multi_date_ctl +=      '<div class="multi-date-month">' + monthAbbr[startDateObj.getMonth()] + '</div>';
          multi_date_ctl +=      '<div title="Edit Date" class="edit-date-btn"><i class="fa fa-pencil" ></i></div>';
          multi_date_ctl +=      '<div title="Remove Date" class="remove-date-btn"><i class="fa fa-times" ></i></div>';
          multi_date_ctl +=      '<div class="multi-date-values">';
          multi_date_ctl +=         '<input class="multi-date-date multi-date-start-date" type="hidden" name="values[' + item + '][' + i + '][start_date]" value="' + date_vals['start_date'] + '"/>';
          multi_date_ctl +=         '<input class="multi-date-date multi-date-end-date" type="hidden" name="values[' + item + '][' + i + '][end_date]" value="' + date_vals['end_date'] + '"/>';
          multi_date_ctl +=         '<label><span class="label-text"><i class="fa fa-calendar"></i> Start Day</span> ';
          multi_date_ctl +=           '<input class="multi-date-day multi-date-start-day gpinput" type="text" name="values[' + item + '][' + i + '][start_day]" value="' + date_vals['start_day'] + '"/>';
          multi_date_ctl +=         '</label>';
          multi_date_ctl +=         '<label><span class="label-text"><i class="fa fa-clock-o"></i> Start Time</span> ';
          multi_date_ctl +=           '<input class="multi-date-time multi-date-start-time gpinput" type="text" name="values[' + item + '][' + i + '][start_time]" value="' + date_vals['start_time'] + '"/>';
          multi_date_ctl +=         '</label>';
          multi_date_ctl +=         '<label><span class="label-text"><i class="fa fa-calendar"></i> End Day</span> ';
          multi_date_ctl +=           '<input class="multi-date-day multi-date-end-day gpinput" type="text" name="values[' + item + '][' + i + '][end_day]" value="' + date_vals['end_day'] + '"/>';
          multi_date_ctl +=         '</label>';
          multi_date_ctl +=         '<label><span class="label-text"><i class="fa fa-clock-o"></i> End Time</span> ';
          multi_date_ctl +=           '<input class="multi-date-time multi-date-end-time gpinput" type="text" name="values[' + item + '][' + i + '][end_time]" value="' + date_vals['end_time'] + '"/>';
          multi_date_ctl +=         '</label>';

          // Status select --start
          var options = '';
          if( $.isPlainObject(control_map['status']['options']) ){ 
            $.each(control_map['status']['options'], function(option_value, option_text){
              var selected = (option_value == date_vals['status'] ? ' selected="selected"' : '');
              options += ('<option value="' + option_value + '"' + selected + '>' + option_text + '</option>');
            });
          }else{
            options += '<option value="">No status options defined!</option>';
          }
          multi_date_ctl +=   '<label><span class="label-text">' + control_map['status']['label'] + '</span> '
          multi_date_ctl +=     '<select class="multi-date-select gpselect" name="values[' + item + '][' + i + '][status]">'
          multi_date_ctl +=       options
          multi_date_ctl +=     '</select>' 
          multi_date_ctl +=   '</label>';
          // Status select --end

          // Role select --start
          var options = '';
          if( $.isPlainObject(control_map['role']['options']) ){ 
            $.each(control_map['role']['options'], function(option_value, option_text){
              var selected = (option_value == date_vals['role'] ? ' selected="selected"' : '');
              options += ('<option value="' + option_value + '"' + selected + '>' + option_text + '</option>');
            });
          }else{
            options += '<option value="">No role options defined!</option>';
          }
          multi_date_ctl +=       '<label><span class="label-text">' + control_map['role']['label'] + '</span> '
          multi_date_ctl +=         '<select class="multi-date-select gpselect" name="values[' + item + '][' + i + '][role]">'
          multi_date_ctl +=           options
          multi_date_ctl +=         '</select>' 
          multi_date_ctl +=       '</label>';
          // Role select --end

          multi_date_ctl +=      '</div>'; // date-list-hidden --end
          multi_date_ctl +=    '</li>';
        });

        multi_date_ctl +=   '</ul>';
        multi_date_ctl +=   '<label>';
        multi_date_ctl +=     '<button id="editor-btn-multi-date-'+ item +'"><i class="fa fa-calendar-plus-o"></i> Add Date</button>';
        multi_date_ctl +=   '</label>';
        multi_date_ctl += '</div>';

        var control = $(multi_date_ctl);
        control.find("a.multi-date-sort").on("click", gp_editor.sortMultiDateItems);
        control.find("#editor-btn-multi-date-" + item + ", .edit-date-btn").on("click", gp_editor.editMultiDateItem);
        control.find(".remove-date-btn").on("click", gp_editor.deleteMultiDateItem);
        control.find(".multi-date-list").sortable({
          update  : function(event, ui){
                      //console.log("event ", event);
                      //console.log("ui ", ui);
                      var current_list = $(event.target);
                      gp_editor.reIndexMultiDateItems(current_list, true);
                    }
        });
        break;

    }


    // bind possibles events
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

        case "multi-date":
          gp_editor.ui.controls.append( gp_editor.getControl("multi-date", control_map, item, value) );
          break;

      }
    }
  }); // each section_object.values --end
 
  gp_editor.cacheValue = gp_editor.getFormElements().serialize();

  loaded();

}

// jquery.fix.clone from https://github.com/spencertipping/jquery.fix.clone
(function (original) {
  jQuery.fn.clone = function () {
    var result           = original.apply(this, arguments),
        my_textareas     = this.find('textarea').add(this.filter('textarea')),
        result_textareas = result.find('textarea').add(result.filter('textarea')),
        my_selects       = this.find('select').add(this.filter('select')),
        result_selects   = result.find('select').add(result.filter('select'));

    for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
    for (var i = 0, l = my_selects.length;   i < l; ++i) {
      for (var j = 0, m = my_selects[i].options.length; j < m; ++j) {
        if (my_selects[i].options[j].selected === true) {
          result_selects[i].options[j].selected = true;
        }
      }
    }
    return result;
  };
}) (jQuery.fn.clone);

