<?php 
/*
##############################################################################################################
Universal Editor Extra Control definition "Multi-Date" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
##############################################################################################################
*/

defined('is_running') or die('Not an entry point...');

$control = array(
  'scripts' =>      array( 'multi_date.js' ), // required
  'stylesheets' =>  array( 'multi_date.css' ), // optional
  'components' =>   array( 'datepicker', 'clockpicker' ), // optional components required for editing: 
                                                          // those may be A) loadable Typesetter components or B) ones defined in ../../components/components.php
);
