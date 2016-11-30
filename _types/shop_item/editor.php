<?php 
/*
#############################################################################################
Editor values for section "Shop Item" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-11-28
Version 1.0b1
#############################################################################################
*/


defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts' => false,  // use a custom editor Javascript for this section type?
  'custom_css' =>     false,  // use a custom editor CSS for this section type?
  'modules' =>        false,  // when using custom editor script(s), we use this to load modules like ck_editor, colorpicker, clickpicker, datepicker
                              // the modules value can be a string 'ck_editor', a csv 'ck_editor,colorpicker' or an array('ck_editor','colorpicker');
                              // with the universal editor, we do not need to set this value, because modules will be loaded with the control_type values
  
  'js_on_content' => 'console.log( "js_on_content, JavaScript code defined in _types/shop_item/editor.php was executed: Editing section id = " + gp_editor.edit_section.attr("id") + " | Timestamp: " + new Date().toJSON() )',  
  // javascript code to be executed when the currently edited section is updated. Use e.g. for re-initing something.
  

  /*---------------------------------------------*/
  /*    If both values above are set to false,   */
  /*         WE USE THE UNIVERSAL EDITOR         */
  /*     (see /universal_editor/edit.js/css)     */
  /*                                             */
  /* The universal editor only needs definitions */
  /* for the controls of the used values.        */
  /*                                             */
  /* This demo 'shop_item' section makes use     */
  /* of all currently available control types.   */
  /*                                             */
  /* More will follow...                         */
  /*---------------------------------------------*/
   
  'controls' => array( 
  
    // the controls array keys must match the section's values

    // value 'image' --start
    'image' => array(
      'label' => '<i class="fa fa-image"></i> Select Image',
      'control_type' => 'finder-select',
      'attributes' => array(),
      'on' => array(
        // event handlers will be bound to the associated hidden input, not the button!
      ),
    ), 
    // value 'image' --end


    // value 'show_badge' --start
    'show_badge' => array(
      'label' => 'Show Badge',
      'control_type' => 'checkbox',
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'show_badge' --end


    // value 'badge_position' --start
    'badge_position' => array(
      'label' => '<i class="fa fa-arrows-alt"></i> Badge Position',
      'control_type' => 'radio-group',
      'radio-buttons' => array( 
        // radio value => radio label
        'top-left' => 'top left',
        'top-right' => 'top right',
        'bottom-left' => 'bottom left',
        'bottom-right' => 'bottom right',
      ),
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'badge_position' --end


    // value 'badge_color' --start
    'badge_color' => array(
      'label' => '<i class="fa fa-paint-brush"></i> Badge Color',
      'control_type' => 'colorpicker', // 'color' for HTML5 color input
      'attributes' => array(
        'placeholder' => '#123ABC',
      ),
      'on' => array(),
    ), 
    // value 'badge_color' --end


    // value 'title' --start
    'title' => array(
      'label' => '<i class="fa fa-font"></i> Title',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Item Title',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'title' --end


    // value 'description' --start
    /* 
    'description' => array(
      'label' => 'Description',
      'control_type' => 'textarea',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'A short description',
      ),
      'on' => array(),
    ), 
    */
    // value 'description' --end


    // value 'description' --start
    'description' => array(
      'label' => '<i class="fa fa-align-left"></i> Edit Description',
      'control_type' => 'ck_editor',
      'attributes' => array(
        // 'class' => '',
        // 'placeholder' => 'A short description',
      ),
      'on' => array(),
    ), 
    // value 'description' --end


    // value 'price' --start
    'price' => array(
      'label' => '<i class="fa fa-dollar"></i> Price',
      'control_type' => 'number',
      'attributes' => array(
        // 'class' => '',
        'step' => 'any',
        'placeholder' => '00.00',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'price' --end


    // value 'available' --start
    'available' => array(
      'label' => '<i class="fa fa-truck"></i> Available',
      'control_type' => 'select',
      'options' => array( 
        // option value => option text
        'in stock' => 'in stock',
        'available short-term' => 'short-term', 
        'available long-term' => 'long-term', 
        'available on request' => 'on request', 
        'sold out' => "sold out", 
      ),
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'available' --end


    // value 'button_link' --start
    'button_link' => array(
      'label' => '<i class="fa fa-globe"></i> Button Link',
      'control_type' => 'link-field',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => '#top, /MyPage or http://some.website.com',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'button_link' --end


    // value 'button_text' --start
    'button_text' => array(
      'label' => '<i class="fa fa-cc-stripe"></i> Button Text',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Click me!',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'button_text' --end


  ),
);