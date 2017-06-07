<?php 
defined('is_running') or die('Not an entry point...');

/* MERELY A DEMO SECTION FOR THE ICONPICKER CONTROL */

$section = array();
$section['values'] = array_merge(array(
  'icon'              => 'fa fa-flag',
  'spin'              => '0',
  'pulse'             => '0',
  'fixed_width'       => '0',
  'flip_horizontal'   => '0',
  'flip_vertical'     => '0',
  'rotate'            => '0',
), $sectionCurrentValues );

$section['attributes'] = array(
  'class' => 'col-xs-12 col-sm-6 col-md-4',
);

$icon_class = 'fa ' . $section['values']['icon'];
$icon_class .= ($section['values']['spin'] == '1' ? ' fa-spin' : '');
$icon_class .= ($section['values']['pulse'] == '1' ? ' fa-pulse' : '');
$icon_class .= ($section['values']['fixed_width'] == '1' ? ' fa-fw' : '');
$icon_class .= ($section['values']['flip_horizontal'] == '1' ? ' fa-flip-horizontal' : '');
$icon_class .= ($section['values']['flip_vertical'] == '1' ? ' fa-flip-vertical' : '');
$icon_class .= ($section['values']['rotate'] != '0' ? ' fa-rotate-' . $section['values']['rotate'] : '');

$section['content']  = '<div class="my-square-box">';
$section['content'] .=   '<div class="my-icon-box">';
$section['content'] .=     '<i class="' . $icon_class . '"></i>';
$section['content'] .=   '</div>';
$section['content'] .= '</div>';

$section['gp_label'] = 'Just a Big Icon';
$section['gp_color'] = '#1EA076';

$section['always_process_values'] = false;

$components = 'fontawesome';

$css_files = array( 'style.css' );
// $style = 'body { background:red!important; }';
// $js_files = array( 'script.js', );
// $javascript = 'var hello_world = "Hello World!";';
// $jQueryCode = '$(".hello").on("click", function(){ alert("Click: " + hello_world); });';
