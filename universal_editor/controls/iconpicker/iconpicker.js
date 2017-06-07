/*
##################################################################################################
Universal Editor Extension JS "iconpicker" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
##################################################################################################

See https://itsjavi.com/fontawesome-iconpicker/ for mor options

*/

CustomSections_editor.extensions['iconpicker'] = {

  controls : {

    iconpicker : function(control_map){
      var item        = control_map['item'];
      var input_type  = control_map['control_type'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes']; 
      var add_classes = control_map['add_classes'];

      var control = $(
          '<div class="editor-ctl-box editor-ctl-iconpicker' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span></label>'
        +   '<div>'
        +     '<input id="editor-ctl-' + item + '" type="text" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
        +   '</div>' 
        + '</div>'
      );
      control.find("#editor-ctl-" + item).iconpicker({
        // title : 'With custom options',
        // icons : ['fa-github', 'fa-heart', 'fa-html5', 'fa-css3'],
        // selectedCustomClass : 'label label-success',
        // mustAccept : true,
        // showFooter : true,
        container : '#ckeditor_wrap',
        placement :'bottomLeft'
      });
      return control;
    } // iconpicker fnc --end

  } // cotrols obj --end

}; /* CustomSections_editor.extensions['fa_icon'] --end */

