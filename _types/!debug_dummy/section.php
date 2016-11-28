<?php 
defined('is_running') or die('Not an entry point...');

/* ####################################################################################### */
/* ################################### DEBUG DUMMY TYPE ################################## */
/* ####################################################################################### */

$section = array(); 

$section['values'] = array_merge(array( 
  'text' => 'It works!', // text
), $sectionCurrentValues );


$section['attributes'] = array(
  'class' => '',
);


$section['content'] = '<h1>{{text}}</h1>';

// $section['gp_label'] = 'Debug Dummy Label';

$section['gp_color'] = '#E5B906';

// $components = 'fontawesome'; 

$css_files = array( 'style.css', 'overruling_style.css' );

// $style = 'body { background:red!important; }';

// $js_files = array( 'script.js', );

// $javascript = 'var hello_world = "Hello World!";'; // this will add a global js variable 

// $jQueryCode = '$(".hello").on("click", function(){ alert("Click: " + hello_world); });';
