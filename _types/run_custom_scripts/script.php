<?php 
defined('is_running') or die('Not an entry point...');

/* 
 * We have the following variables to work with:
 *
 * $page                  The $page object
 *
 * $type                  The current section type ID string
 * $types                 Array of all enabled Custom Section types
 *
 * self::$i18n            The language array, empty if none provided
 *
 * $sectionRelativeCode   e.g. /addons/CustomSections/_types/my_section
 * $sectionRelativeData   e.g. /data/_addondata/CustomSections/my_section
 * $sectionPathCode       e.g. /var/www/hosts/my_typesetter/addons/CustomSections/_types/my_section
 * $sectionPathData       e.g. /var/www/hosts/my_typesetter/data/_addondata/CustomSections/my_section
 *
 */

// msg('type = ' . $type . ', self::$i18n = ' .  pre(self::$i18n) );

$form_id = htmlspecialchars($_POST['form_id']);

if( !empty($form_id) ){
  $page->ajaxReplace = array();
  $do       = 'inner';
  $selector = 'form#' . $form_id . '>h3';
  $content  = 'My IP Address is <strong>' . cs_get_client_ip() . '</strong>';

  $page->ajaxReplace[] = array($do, $selector, $content);
  return 'return';
}


function cs_get_client_ip(){
  $ipaddress = '';
  if( isset($_SERVER['HTTP_CLIENT_IP']) ){
    $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
  }elseif( isset($_SERVER['HTTP_X_FORWARDED_FOR']) ){
    $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
  }elseif( isset($_SERVER['HTTP_X_FORWARDED']) ){
    $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
  }elseif( isset($_SERVER['HTTP_FORWARDED_FOR']) ){
    $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
  }elseif( isset($_SERVER['HTTP_FORWARDED']) ){
    $ipaddress = $_SERVER['HTTP_FORWARDED'];
  }elseif( isset($_SERVER['REMOTE_ADDR']) ){
    $ipaddress = $_SERVER['REMOTE_ADDR'];
  }else{
    $ipaddress = 'UNKNOWN';
  }
  return $ipaddress;
}
