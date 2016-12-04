<?php 
/*
########################################################
Editor definition for Custom Section type "Single Event"
for Typesetter CMS developer plugin - 'Custom Sections'
########################################################
*/


defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts' => false,  // use a custom editor Javascript for this section type?
  'custom_css' =>     false,  // use a custom editor CSS for this section type?
  'modules' =>        false,  // NOT YET TESTED! when using custom editor script(s), we use this to load modules like ck_editor, colorpicker, clockpicker, datepicker
                              // the modules value can be a string 'ck_editor', a csv 'ck_editor,colorpicker' or an array('ck_editor','colorpicker');
                              // with the universal editor, we do not need to set this value, because modules will be loaded with the control_type values
  
  //*disabled */ 'js_on_content' => 'console.log( "js_on_content, JavaScript code defined in _types/shop_item/editor.php was executed: Editing section id = " + gp_editor.edit_section.attr("id") + " | Timestamp: " + new Date().toJSON() )',  
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


    // value 'images' --start
    /*
    'images' => array(
      'label' => '<i class="fa fa-image"></i> Carousel Images',
      'control_type' => 'multi-image',
      'attributes' => array(),
      'on' => array(),
    ),
    */ 
    // value 'images' --end


    // value 'overlay_color' --start
    'overlay_color' => array(
      'label' => '<i class="fa fa-paint-brush"></i> Overlay Color',
      'control_type' => 'colorpicker', // 'color' for HTML5 color input, 'colorpicker' if want rgba
      'attributes' => array(
        'placeholder' => 'rgba(64, 128, 256, 0.5)',
      ),
      'on' => array(),
    ), 
    // value 'overlay_color' --end


    // value 'title' --start
    'title' => array(
      'label' => '<i class="fa fa-font"></i> Title',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Event Title',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'title' --end


    // value 'subtitle' --start
    'subtitle' => array(
      'label' => '<i class="fa fa-font"></i> Subtitle',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Event Subtitle',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'subtitle' --end


    // value 'description' --start
    /*
    'description' => array(
      'label' => '<i class="fa fa-align-left"></i> Edit Description',
      'control_type' => 'ck_editor',
      'attributes' => array(
        // 'class' => '',
        // 'placeholder' => 'A short description',
      ),
      'on' => array(),
    ),
    */ 
    // value 'description' --end


    // value 'location_name' --start
    'location_name' => array(
      'label' => '<i class="fa fa-home"></i> Location Name',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'e.g. City Hall',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'title' --end


    // value 'location_link' --start
    'location_link' => array(
      'label' => '<i class="fa fa-globe"></i> Location Link',
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
    // value 'location_link' --end


    // value 'start_day' --start
    'start_day' => array(
      'label' => '<i class="fa fa-calendar"></i> Start Day',
      'control_type' => 'datepicker',
      'components' => 'datepicker', // comma seperated string. We need jQuery UI datepicker here for editing
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Click me!',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'start_day' --end


    // value 'start_time' --start
    'start_time' => array(
      'label' => '<i class="fa fa-clock-o"></i> Start Time',
      'control_type' => 'clockpicker',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Click me!',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'start_time' --end


    // value 'end_day' --end
    'end_day' => array(
      'label' => '<i class="fa fa-calendar"></i> End Day',
      'control_type' => 'datepicker',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Click me!',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'end_day' --end


    // value 'end_time' --end
    'end_time' => array(
      'label' => '<i class="fa fa-clock-o"></i> End Time',
      'control_type' => 'clockpicker',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Click me!',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'end_time' --end


    // value 'use_booking' --start
    'use_booking' => array(
      'label' => 'Use Booking',
      'control_type' => 'checkbox',
      'attributes' => array(),
      'on' => array(),
    ),
    // value 'show_badge' --end


    // value 'booking_text' --start
    'booking_text' => array(
      'label' => '<i class="fa fa-home"></i> Booking (text)',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'e.g. Tickets',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'booking_text' --end


    // value 'booking_status' --start
    'booking_status' => array(
      'label' => '<i class="fa fa-ticket"></i> Booking Status',
      'control_type' => 'select',
      'options' => array( 
        // option value => option text
        'bookable' =>     'bookable',
        'booked-out' =>   "booked out", 
        'canceled' =>     "canceled", 
      ),
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'booking_status' --end


    // value 'booking_link' --start
    'booking_link' => array(
      'label' => '<i class="fa fa-globe"></i> Booking Link',
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
    // value 'booking_link' --end


    // value 'readmore_text' --start
    'readmore_text' => array(
      'label' => '<i class="fa fa-cc-stripe"></i> &lsquo;Read More&rsquo; Text',
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
    // value 'readmore_text' --end


    // value 'readmore_link' --start
    'readmore_link' => array(
      'label' => '<i class="fa fa-globe"></i> &lsquo;Read More&rsquo; Link',
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
    // value 'readmore_link' --end

  ),
);