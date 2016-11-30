<?php 
defined('is_running') or die('Not an entry point...');

/* ####################################################################################### */
/* ################################ DEMO TYPE "SHOP ITEM" ################################ */
/* ############################## CUSTOM SECTION DEFINITION ############################## */
/* ####################################################################################### */
/* ###    $sectionRelativeCode == relative path to this folder, e.g. to load images    ### */
/* ###    $sectionCurrentValues == updated values array, empty for new section         ### */
/* ####################################################################################### */

$section = array(); 

// Required: default values for new sections
// We merge $sectionCurrentValues right here, so we can use $section['values'] for conditional rendering down * in the 'content' key.
$section['values'] = array_merge(array( 
  'image'           =>  $sectionRelativeCode . '/img/default_image.png', // finder-select
  'show_badge'      => '1', // checkbox
  'badge_position'  => 'top-left', // radio group
  'badge_color'     => '#ABD117', // color
  'title'           => 'Custom Sections!', // text
  'description'     => 'A brand-new plugin to <strong>prototype sections</strong> with custom editors <em>in no time</em>. Hands-on!', // ck_editor
  'available'       => 'in stock', // select 
  'price'           => '0.00', // number
  'button_link'     => array( 
                        'url' => 'https://www.typesettercms.com/Plugins',  // absolute URL, relative URL, mailto, #anchor
                        'target' => '_blank', // _blank, _self
                       ), // link-field
  'button_text'     => 'get it', // text, span and &zwnj; if we want to use CKE
  'images'			=> array($sectionRelativeCode . '/img/default_image.png',
							 $sectionRelativeCode . '/img/default_image_c.png',
							 $sectionRelativeCode . '/img/default_image_r.png',
							 $sectionRelativeCode . '/img/default_image_e.png',),//array of images for muliply image field
), $sectionCurrentValues );


// Required: we should always include an attributes array, even when it's empty
$section['attributes'] = array(
  'class' => 'col-md-4 col-sm-6',  // optional: 'filetype-shop_item' class will be added by the system
  // 'style' => '', // optional inline styles
);


// Required: Predefined section content
// use {{value key}} for simple value placeholders/replacements
// use $section['values']['xyz'], e.g. for conditional rendering * whole elements 
$section['content'] = 
'<div class="shop-item-box">
  <div class="image-clip"><img alt="Image of {{title}}" src="{{image}}" />';

if( $section['values']['show_badge'] == '1' ){ // * here ;)
  $section['content'] .= '<div class="item-badge item-badge-{{badge_position}}" style="background-color:{{badge_color}};">NEW!</div>';
}

$section['content'] .= 
' </div>
  <div class="item-info">
    <div class="row">
      <div class="col-xs-12 item-text">
        <h3 class="item-title text-center">{{title}}</h3>
        <p class="item-description text-left">{{description}}</p>
        <hr/>
      </div>
      <div class="col-md-6">
        <p><span class="fa-stack fa-1x"><i class="fa fa-circle fa-stack-2x text-primary"></i> <i class="fa fa-truck fa-stack-1x fa-inverse"></i></span> {{available}}</p>
      </div>
      <div class="col-md-6 text-right">
        <h4 class="item-price">EUR {{price}}</h4>
        <a href="{{button_link|url}}" class="btn btn-success btn-block" target="{{button_link|target}}"><span class="fa fa-download">&zwnj;</span> {{button_text}}</a>
      </div>
    </div>
  </div>
</div>
';


// bootstrap carousel of images example
$car=crc32(uniqid("",true)); $number=count($section["values"]["images"]); $i = 1;

$section['content'] .= '<div id="'.$car.'" class="carousel slide qwerty" data-ride="carousel">';
		
		$section['content'] .= '<ol class="carousel-indicators">';
		
			$section['content'] .= '<li data-target="#'.$car.'" data-slide-to="0" class="active"></li>';
				
		while ($i < $number) { 
				$section['content'] .= '<li data-target="#'.$car.'" data-slide-to="'.$i.'"></li>';

				 $i++;  
			} 
		$section['content'] .= '</ol>';

		
	$section['content'] .= '<div class="carousel-inner" role="listbox">';
								
	$section['content'] .= '<div class="item active"><img src="{{images|0}}" ></div>';
			
			$i = 1;
			while ($i < $number) { 
			   $section['content'] .= ' <div class="item"><img src="{{images|'.$i.'}}" ></div>';
				$i++;  
			 } 
	$section['content'] .='</div>';

$section['content'] .= 
	'<a class="left slide-control" href="#'.$car.'" role="button" data-slide="prev"><i class="fa fa-angle-left">&zwnj;</i></a>
	<a class="right slide-control" href="#'.$car.'" role="button" data-slide="next"><i class="fa fa-angle-right">&zwnj;</i></a>
	</div>';
	

// Recommended: Section Label. If not defined, it will be generated from the folder name.
$section['gp_label'] = 'Shop Item';

// Optional: Always process values - if set to true, content will always be generated by processing values, even when not logged-in.
// Using this option, sections may have dynamic content.
$section['always_process_values'] = true;

// Optional: Admin UI color label. This is solely used in the editor's section manager ('Page' mode)
$section['gp_color'] = '#DE3265';


// Optional: Loadable Components, see https://github.com/Typesetter/Typesetter/blob/master/include/tool/Output/Combine.php#L111
$components = 'fontawesome'; // comma separated string. If 'colorbox' is included \gp\tool::AddColorBox() will be called

// Ootional: Additional CSS and JS if needed
$css_files = array( 'style.css', );

// $style = 'body { background:red!important; }';

// $js_files = array( 'script.js', );

// $javascript = 'var hello_world = "Hello World!";'; // this will add a global js variable 

// $jQueryCode = '$(".hello").on("click", function(){ alert("Click: " + hello_world); });';
