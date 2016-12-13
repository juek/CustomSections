/*
##################################################################################################
Universal Editor Extension JS "Multi-Date" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
##################################################################################################
*/

// $.extend(true, gp_editor, {
CustomSections_editor.extensions['multi_date'] = {

  editMultiDateItem : function(e){
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
    adminBox.find('input.multi-date-start-day').focus().select(); // re-focus after datepicker init
  }, // reIndexMultiDateItems --end



  reIndexMultiDateItems : function(list, unset_sort_button){
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
    list.replaceWith(new_list)
    new_list.sortable({
      update  : function(event, ui){
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
  }, // editMultiDateItem --end


  sortMultiDateItems : function(e){
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
  }, // sortMultiDateItems --end



  deleteMultiDateItem : function(e){
    var clicked_element = $(e.target);
    if( confirm("Really delete this date?") ){
      var current_list = clicked_element.closest("ul");
      clicked_element.closest("li").remove();
      gp_editor.reIndexMultiDateItems(current_list, false);
    }
  }, // deleteMultiDateItem --end



  updateMultiDateItem : function(){
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
    var startDateObj = new Date(start_date * 1000); // JS Date() needs miliseconds
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
  }, // updateMultiDateItem --end



  controls : {

    multi_date : function(control_map){
      var item        = control_map['item'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes'];
      var add_classes = control_map['add_classes'];

      var monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Novr", "Dec"];
      var multi_date_ctl = '<div class="editor-ctl-box editor-ctl-multi-date' + add_classes + '">';
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
        var startDateObj = new Date( date_vals['start_date'] * 1000 );
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
      return control;
    } // multi_date fnc --end

  } // cotrols obj --end

}; /* CustomSections_editor.extensions['multi_date'] --end */



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

