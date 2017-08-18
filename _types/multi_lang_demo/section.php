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

$section_lang = self::$i18n['section']['lang'];

/* for debugging show language array in message bar */
// msg('Section type <em>' . $type .'</em> &rarr; $i18n = ' . pre(self::$i18n));

$section = array();
$section['values'] = array_merge(array(
  'heading'       => $section_lang['default_heading'],
  'heading_type'  => 'h2',
), $sectionCurrentValues );

$section['attributes'] = array(
  'class' => 'i18n-section',
);

$section['content']   = '<' . $section['values']['heading_type'] .'>';
$section['content']  .= $section_lang['heading'] . '(' . $section['values']['heading_type'] . '): ' . $section['values']['heading'];
$section['content']  .= '</' . $section['values']['heading_type'] .'>';

$section['gp_label'] = 'i18n Demo';
$section['gp_color'] = '#00adee';

$section['always_process_values'] = false;

$css_files = array( 'style.css' );
// $style = 'body { background:red!important; }';
// $js_files = array( 'script.js', );
$javascript = 'var mld_section_lang = ' . json_encode($section_lang) . ';';
// $jQueryCode = '$(".hello").on("click", function(){ alert("Click: " + hello_world); });';
