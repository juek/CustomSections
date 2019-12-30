<?php 
/*
##############################################################################################################
Universal Editor Loadable Components definition for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
##############################################################################################################
*/


defined('is_running') or die('Not an entry point...');

$ckeditor_dir = version_compare(gpversion, '5.1') > 0 ? 'ckeditor' : 'ckeditor_34';

$components = array(

  'ckeditor' => array(
    'scripts' => array( 
      array( 'code' => 'CKEDITOR_BASEPATH = ' . \gp\tool\Output\Ajax::quote( \gp\tool::GetDir('/include/thirdparty/' . $ckeditor_dir . '/') ) . '; ' ),
      array( 'code' => 'var CS_ckconfig = ' . \gp\tool\Editing::CKConfig(array(), 'json', $plugins) . '; '),
      array( 'code' => 'var gp_add_plugins = ' . json_encode( $plugins ) . '; '),
      '/include/thirdparty/' . $ckeditor_dir . '/ckeditor.js',
      '/include/js/ckeditor_config.js',
    ),
  ),

  'colorpicker' => array(
    'scripts' =>      array( 'bootstrap_colorpicker/bootstrap-colorpicker.min.js' ),
    'stylesheets' =>  array( 'bootstrap_colorpicker/bootstrap-colorpicker.css' ),
  ),

  'clockpicker' => array(
    'scripts' =>      array( 'jquery_clockpicker/jquery-clockpicker.min.js', ),
    'stylesheets' =>  array( 'jquery_clockpicker/jquery-clockpicker.min.css', ),
  ),

  'autocomplete_pages' => array(
     'scripts' => array( 
        array( 'code' => \gp\tool\Editing::AutoCompleteValues(true) ), 
      ),
   ),

);
