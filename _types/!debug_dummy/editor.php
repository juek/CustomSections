<?php 
/*
##############################################################################################
Editor values for section "Debug Dummy" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-11-28
Version 1.0b1
##############################################################################################
*/


defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_script' => false,
  'custom_css' =>    false,

  'controls' => array( 
  
    // value 'text' --start
    'text' => array(
      'label' => 'Text',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Some text...',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        // 'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'text' --end

  ),
);