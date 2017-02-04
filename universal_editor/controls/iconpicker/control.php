<?php 
/*
####################################################################################################################
Universal Editor Extra Control definition "iconpicker" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2017-02-04
Version 1.0b2
####################################################################################################################
*/

defined('is_running') or die('Not an entry point...');

$control = array(
  'scripts' =>      array( 'fontawesome-iconpicker/js/fontawesome-iconpicker.js', 'iconpicker.js' ), // required javascript(s) to extend the 'universal editor'
  'stylesheets' =>  array( 'fontawesome-iconpicker/css/fontawesome-iconpicker.css', 'iconpicker.css' ), // optional stylesheet(s) to display the editor control
  'components' =>   array( 'bootstrap3-popover' ), // optional components required for editing 
);
