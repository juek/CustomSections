<?php 
defined('is_running') or die('Not an entry point...');

/* ####################################################################################### */
/* ################################## DEMO TYPE COMPASS NAV ############################## */
/* ####################################################################################### */

$section = array();

// Required: values
$section['values'] = array_merge(array( 
  'angle' => '15', // the compass needle's default angle
  'north_link_text' => 'Home',
  'north_link' => array( 
                'url' => \gp\tool::GetUrl(''), // http://ab.solu.te/url or /relative_url, mailto:me@mydomain.com, #anchor_id
                'target' => '_self', // _blank, _self
               ), // control_type = link-field
  'east_link_text' => 'Child Page',
  'east_link' => array( 
                'url' => \gp\tool::GetUrl('Child_Page'),
                'target' => '_self',
               ), // control_type = link-field
  'south_link_text' => 'About',
  'south_link' => array( 
                'url' => \gp\tool::GetUrl('About'),
                'target' => '_self',
               ), // control_type = link-field
  'west_link_text' => 'Contact',
  'west_link' => array( 
                'url' => \gp\tool::GetUrl('Contact'),
                'target' => '_self',
               ), // control_type = link-field

), $sectionCurrentValues );

$section['attributes'] = array(
  'class' => 'col-xs-12 col-md-6',  // Optional: some Bootstrap Grid classes
);

// Required: Section default content
$section['content'] = '<div class="compass-nav-wrapper">
  <img class="compass-dial" src="' . $sectionRelativeCode . '/img/compass-dial.png" alt="Compass Dial"/>
  <img class="compass-needle" src="' . $sectionRelativeCode . '/img/compass-needle.png" 
    style="-webkit-transform:rotate({{angle}}deg); transform:rotate({{angle}}deg);" 
    data-angle="{{angle}}" 
    alt="Compass Needle"/>
  <div class="compass-nav">
    <div class="north-link-wrapper"><a href="{{north_link|url}}" target="{{north_link|target}}">{{north_link_text}}</a></div>
    <div class="east-link-wrapper"><a href="{{east_link|url}}" target="{{east_link|target}}">{{east_link_text}}</a></div>
    <div class="south-link-wrapper"><a href="{{south_link|url}}" target="{{south_link|target}}">{{south_link_text}}</a></div>
    <div class="west-link-wrapper"><a href="{{west_link|url}}" target="{{west_link|target}}">{{west_link_text}}</a></div>
  </div>
</div>';

$section['gp_label'] = 'Compass Nav';                 // Optional editor label.
$section['gp_color'] = '#00A2D3';                     // Optional editor color.

$section['always_process_values'] = false;            // true only for dynamic value processing.

// $components = 'fontawesome';                       // Optional: Typesetter components required at user runtime.

$css_files = array( 'style.css' );                    // Optional: Stylesheet(s) used for section rendering.
$js_files = array( 
  'lib/FitText.js/jquery.fittext.js',
  'lib/Lettering.js/jquery.lettering.js',
  'lib/CircleType/circletype.min.js',
  'script.js',   
);                    // Optional: JavaScript file(s) used for section rendering.

// $style = 'body { background:red!important; }';     // Optional: Inline CSS used for section rendering.
// $javascript = 'var hello_world = "Hello World!";'; // Optional: Inline JavaScript used for section rendering.
// $jQueryCode = '$(document).on("CustomSection:updated", "div.GPAREA", function(){ console.log("The event \"CustomSection:updated\" was triggered on section ", $(this)); });'; 
