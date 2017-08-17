<?php 

defined('is_running') or die('Not an entry point...');

/*
 *
 * Internationalization (i18n) Demo 
 *
 * We have the sections 'i18n' language array 
 * self::$i18n['editor']['lang']           = $section_lang array from /lang/[current admin ui language].php
 * self::$i18n['editor']['langmessgae']    = Typesetter's $langmessage array in current admin ui language 
 * 
 * If Multi-Language Manager plugin is used, there is also...
 * self::$i18n['section']['lang']          = $section_lang array from /lang/[current page language].php
 * self::$i18n['section']['langmessgae']   = Typesetter's $langmessage array in current page langauge
 *
 */

$editor_lang = self::$i18n['editor']['lang'];

$editor = array(
  'custom_scripts'  => false,
  'custom_css'      => false,
  'controls'        => array(

    // value 'heading' --start
    'heading' => array(
      'label' => '<i class="fa fa-font"></i> ' . $editor_lang['heading'],
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => $editor_lang['heading_placeholder'],
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ), 
    // value 'heading' --end


    // value 'heading_type' --start
    'heading_type' => array(
      'label' => '<i class="fa fa-header"></i> ' . $editor_lang['heading_type'],
      'control_type' => 'select',
      'options' => array( 
        // option value => option text
        'h1'  =>  $editor_lang['h1'],
        'h2'  =>  $editor_lang['h2'],
        'h3'  =>  $editor_lang['h3'],
        'h4'  =>  $editor_lang['h4'],
        'h5'  =>  $editor_lang['h5'],
        'h6'  =>  $editor_lang['h6'],
      ),
      'attributes' => array(),
      'on' => array(),
    ), 
    // value 'heading_type' --end


  ),
);
