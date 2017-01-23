<?php 
/*
####################################################################
Editor definition for Custom Section type "Selectalbe Size"
for Typesetter CMS developer plugin - 'Custom Sections'
####################################################################
*/


defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts' =>     false,  // use a custom editor Javascript for this section type?
  'custom_css' =>         false,  // use a custom editor CSS for this section type?
  'editor_components' =>  false,  // only when using custom editor script(s), we use this to load components like ck_editor, colorpicker, clockpicker, datepicker
                                  // the components value can be a string 'ck_editor', a csv 'ck_editor,colorpicker' or an array('ck_editor','colorpicker');
                                  // when the universal editor is used, we do not need to set this value, because components will be auto loaded with the respective control_type
  //*disabled */ 'js_on_content' => '',  

  'controls' => array( 

    // value 'heading' --start
    'heading' => array(
      'label' => '<i class="fa fa-font"></i> Heading',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Well, a heading',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'heading' --end


    // value 'text' --start
    'text' => array(
      'label' => '<i class="fa fa-font"></i> Text',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'And some text',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'text' --end



    // value 'grid_classes' --start
    'grid_classes' => array(
      'label' => '<i class="fa fa-th-large"></i> Grid Column Size',
      'control_type' => 'radio_group', // also possible: controls: select, text
      'radio-buttons' => array( 
        // radio value                  => radio label
        'col-xs-12 col-sm-6 col-md-4'   => 'small',
        'col-xs-12 col-sm-6 col-md-6'   => 'medium',
        'col-xs-12 col-sm-12 col-md-8'  => 'large',
      ),
      'attributes' => array(
        // ##########################################################################################################################################
        'data-applyto' => 'class', // ###### this attribute tells the editor that the value shall be applied to the section's class attribute #######
        // ##########################################################################################################################################
      ),
      'on' => array(),
    ), 
    // value 'grid_classes' --end

  ),
);
