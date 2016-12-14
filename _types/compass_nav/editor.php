<?php 

defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts' => false,    // false = we use universal editor
  'custom_css' =>     false,    // false = we use universal editor

  'controls' => array( 

    // value 'angle' --start
    'angle' => array(
      'label' => '<i class="fa fa-rotate-right"></i> Compass Needle Angle',
      'control_type' => 'knob', // extra control 'knob', see /universal_editor/controls/knob/
      'attributes' => array(
        /* accepted data attributes, see http://anthonyterrien.com/knob/ */
        'data-min' => '0',
        'data-max' => '360',
        'data-step' => '1',
        'data-width' => '76', // default=1000(px)|%|em
        'data-height' => '76', // default=100(px)|%|em
        'data-cursor' => '0.1', // false|true|gauge|numeric value
        //'data-thickness' => '0.3', // gauge thickness 0-1
        'data-lineCap' => 'round', // butt|round
        //'data-displayInput' => 'true',
        //'data-font' => 'sans-serif',
        //'data-fontWeight' => 'bold',
        'data-inputColor' => '#87CEEB',
        'data-fgColor' => '#87CEEB',
        'data-bgColor' => '#EEEEEE',
        'data-displayPrevious' => 'true',
        //'data-angleOffset' => '90',
        //'data-angleArc' => '250',
        //'data-rotation' => 'clockwise', // clockwise|anticlockwise
        //'data-stopper' => 'true',
        //'data-readOnly' => 'false',
      ),
    ), 
    // value 'angle' --end


    // value 'north_link_text' --start
    'north_link_text' => array(
      'label' => '<i class="fa fa-arrow-circle-o-up"></i> North Link Text',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Some text',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'north_link_text' --end

    // value 'north_link' --start
    'north_link' => array(
      'label' => '<i class="fa fa-arrow-circle-up"></i> North Link',
      'control_type' => 'link_field',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => '#top, /MyPage or http://some.website.com',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'north_link' --end


    // value 'east_link_text' --start
    'east_link_text' => array(
      'label' => '<i class="fa fa-arrow-circle-o-right"></i> East Link Text',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Some text',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'east_link_text' --end
    
    // value 'east_link' --start
    'east_link' => array(
      'label' => '<i class="fa fa-arrow-circle-right"></i> East Link',
      'control_type' => 'link_field',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => '#top, /MyPage or http://some.website.com',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'east_link' --end


    // value 'south_link_text' --start
    'south_link_text' => array(
      'label' => '<i class="fa fa-arrow-circle-o-down"></i> South Link Text',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Some text',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'south_link_text' --end

    // value 'south_link' --start
    'south_link' => array(
      'label' => '<i class="fa fa-arrow-circle-o-down"></i> South Link',
      'control_type' => 'link_field',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => '#top, /MyPage or http://some.website.com',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'south_link' --end


    // value 'west_link_text' --start
    'west_link_text' => array(
      'label' => '<i class="fa fa-arrow-circle-o-left"></i> West Link Text',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Some text',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'west_link_text' --end
    
    // value 'west_link' --start
    'west_link' => array(
      'label' => '<i class="fa fa-arrow-circle-left"></i> West Link',
      'control_type' => 'link_field',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => '#top, /MyPage or http://some.website.com',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'west_link' --end
  ),
);
