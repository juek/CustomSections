<?php 
defined('is_running') or die('Not an entry point...');

/*
 *
 * Section Type to simply demo custom script execution (via AJAX)
 *
 * see script.js and script.php in this folder
 *
 */

$section = array();
$section['values'] = $sectionCurrentValues;
$section['attributes'] = array();

$id = \gp\tool::RandomString(10);

$section['content']   = '<form class="cs-get-my-ip" id="cs-' . $id . '">';
$section['content']  .= '<h3>My IP Address &hellip;</h3>';
$section['content']  .= '<input type="submit" value="get my IP"/>';
$section['content']  .= '</form>';

$section['gp_label'] = 'Custom Script Demo';
$section['gp_color'] = '#eb5e28';

$section['always_process_values'] = true;

$css_files   = array( 'style.css', );
// $style       = 'body { background:red!important; }';
$js_files    = array( 'script.js', );
// $javascript  = 'var hello_world = "Hello World!";'; // Optional: Inline JavaScript used for section rendering.
// $jQueryCode  = '$(".hello").on("click", function(){ alert("Click: " + hello_world); });';
