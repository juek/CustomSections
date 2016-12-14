<?php 
defined('is_running') or die('Not an entry point...');

/* ####################################################################################### */
/* #################################### DEMO TYPE COMPASS ################################ */
/* ####################################################################################### */

$section = array();

$section['values'] = array_merge(array( 
  'angle' => '0',                                     // Required: only one value here
), $sectionCurrentValues );

$section['attributes'] = array(
  'class' => 'col-xs-12 col-md-6',  // Optional: some Bootstrap Grid classes
);

$section['content'] = '<div class="compass-wrapper">
  <img class="compass-dial" src="' . $sectionRelativeCode . '/img/compass-dial.png" alt="Compass Dial"/>
  <img class="compass-needle" src="' . $sectionRelativeCode . '/img/compass-needle.png" 
    style="-webkit-transform:rotate({{angle}}deg); transform:rotate({{angle}}deg);" 
    data-angle="{{angle}}" 
    alt="Compass Needle"/>
</div>';                                              // Required: Section default content.

$section['gp_label'] = 'Compass';                     // Optional editor label.
$section['gp_color'] = '#00A2D3';                     // Optional editor color.

$section['always_process_values'] = false;            // true only for dynamic value processing.

// $components = 'fontawesome';                       // Optional: Typesetter components required at user runtime.

$css_files = array( 'style.css' );                    // Optional: Stylesheet(s) used for section rendering.
$js_files = array( 'script.js', );                    // Optional: JavaScript file(s) used for section rendering.

// $style = 'body { background:red!important; }';     // Optional: Inline CSS used for section rendering.
// $javascript = 'var hello_world = "Hello World!";'; // Optional: Inline JavaScript used for section rendering.
// $jQueryCode = '$(".hello").on("click", function(){ alert("Click: " + hello_world); });'; // Optional: Inline jQuery used for section rendering. Executed at DOM.ready.
