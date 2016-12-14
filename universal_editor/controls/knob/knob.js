/*
##################################################################################################
Universal Editor Extension JS "knob" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
##################################################################################################
*/

CustomSections_editor.extensions['knob'] = {

  knobRelease : function(v){
    if( window.console ){
      console.log("Knob on input#" + $(this).attr("id") + " released with value " + v); 
    }
  }, 

  knobChange : function(v){
    if( window.console ){
      console.log("Knob on input#" + $(this).attr("id") + " changed value to " + v); 
    }
  }, 

  controls : {

    knob : function(control_map){
      var item        = control_map['item'];
      var input_type  = control_map['control_type'];
      var value       = control_map['value'];
      var attributes  = control_map['attributes']; // see accepted attributes below 
      var add_classes = control_map['add_classes'];

      var control = $(
          '<div class="editor-ctl-box editor-ctl-knob' + add_classes + '">'
        +   '<label><span class="label-text">' + control_map['label'] + '</span></label>'
        +   '<div>'
        +     '<input id="editor-ctl-' + item + '" type="text" name="values[' + item + ']" value="' + value + '"' + attributes + '/>'
        +   '</div>' 
        + '</div>'
      );
      control.find("#editor-ctl-" + item).knob({
        'release' : gp_editor.knobRelease,
        'change'  : gp_editor.knobChange,
      });
      return control;
    } // range fnc --end

  } // cotrols obj --end

}; /* CustomSections_editor.extensions['knob'] --end */


/* accepted data attributes, see http://anthonyterrien.com/knob/

data-width="100"
data-height="100"
data-cursor=false|true|gauge|numeric value
data-thickness=.3

data-displayInput=true|false
data-font="sans-serif"
data-fontWeight="bold"
data-inputColor="#87CEEB"
data-fgColor="#87CEEB"
data-bgColor="#eeeee"

data-displayPrevious=false
data-angleOffset=90
data-angleArc=250
data-rotation=clockwise|anticlockwise
data-lineCap=butt|round
data-stopper=true
data-min="0"
data-max="100"
data-step="1"
data-readOnly=false

*/





