<?php 

defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts'  => false,
  'custom_css'      => false,
  'controls'        => array(
  
    // value 'icon' --start
    'icon' => array(
      'label' => '<i class="fa fa-flag"></i> Icon',
      'control_type' => 'iconpicker', /* ##### THE NEW CONTROL TYPE #### */
      'attributes' => array(
        // 'placeholder' => 'fa fa-flag',
      ),
      'on' => array(
        // 'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'icon' --end

    // value 'spin' --start
    'spin' => array(
      'label' => 'Spin',
      'control_type' => 'checkbox',
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'spin' --end

    // value 'pulse' --start
    'pulse' => array(
      'label' => 'Pulse',
      'control_type' => 'checkbox',
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'pulse' --end

    // value 'fixed_width' --start
    'fixed_width' => array(
      'label' => 'Fixed Width',
      'control_type' => 'checkbox',
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'fixed_width' --end

    // value 'flip_horizontal' --start
    'flip_horizontal' => array(
      'label' => 'Flip Horzizontal',
      'control_type' => 'checkbox',
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'flip_horizontal' --end

    // value 'flip_vertical' --start
    'flip_vertical' => array(
      'label' => 'Flip Vertical',
      'control_type' => 'checkbox',
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'flip_vertical' --end

    // value 'rotate' --start
    'rotate' => array(
      'label' => '<i class="fa fa-refresh"></i> Rotate',
      'control_type' => 'select',
      'options' => array( 
        // option value => option text
        '0' => 'none (0 &deg;)',
        '90' => '90 &deg;',
        '180' => '180 &deg;',
        '270' => '270 &deg;',
      ),
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'rotate' --end

  ),
);
