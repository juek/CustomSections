<?php 
/*
####################################################################################################################
Universal Editor Extra Control definition "knob" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
####################################################################################################################
*/

defined('is_running') or die('Not an entry point...');

$control = array(
  'scripts' =>      array( 'jquery.knob.min.js', 'knob.js' ), // required javascript(s) to extend the 'universal editor'
  'stylesheets' =>  array( 'knob.css' ), // optional stylesheet(s) to display the editor control
  // 'components' => array( 'datepicker' ), // optional components required for editing 
);
