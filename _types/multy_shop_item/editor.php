<?php 
/*
#############################################################################################
Editor values for section "Shop Item" for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-11-28
Version 1.0b1
#############################################################################################
*/


defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts' =>     false,  // use a custom editor Javascript for this section type?
  'custom_css' =>         false,  // use a custom editor CSS for this section type?
  'editor_components' =>  false,  // only when using custom editor script(s), we use this to load components like ck_editor, colorpicker, clockpicker, datepicker
                                  // the components value can be a string 'ck_editor', a csv 'ck_editor,colorpicker' or an array('ck_editor','colorpicker');
                                  // when the universal editor is used, we do not need to set this value, because components will be auto loaded with the respective control_type
  
  //*disabled */ 'js_on_content' => 'console.log( "js_on_content, JavaScript code defined in _types/shop_item/editor.php was executed: Editing section id = " + gp_editor.edit_section.attr("id") + " | Timestamp: " + new Date().toJSON() )',  
      // javascript code to be executed when the currently edited section is updated. Use e.g. for re-initing something.
  

  /*---------------------------------------------*/
  /*        							        */ 
 /*   			BUNCH CONTROL DEMO			   */
  /*        							        */
  /*---------------------------------------------*/
   
  'controls' => array( 
  

	'shop_items'=>array(
			'label' => '<i class="fa fa-file-text-o"></i> Shop Item',
			'control_type' => 'bunch_control',
			'sub_controls'=>array(
							// value 'image' --start
							'image' => array('label' => '<i class="fa fa-image"></i> Select Image','control_type' => 'finder_select',), 
								// value 'image' --end
							    'show_badge' => array(
										  'label' => 'Show Badge',
										  'control_type' => 'checkbox',
										  'attributes' => array(),
										  'on' => array(),
										), 
										
							'badge_position' => array(
											  'label' => '<i class="fa fa-arrows-alt"></i> Badge Position',
											  'control_type' => 'radio_group',
											  'radio-buttons' => array( 
												// radio value => radio label
												'top-left' => 'top left',
												'top-right' => 'top right',
												'bottom-left' => 'bottom left',
												'bottom-right' => 'bottom right',
											  ),
											  'attributes' => array(),
											  'on' => array(),
											), 
							    'badge_color' => array(
												  'label' => '<i class="fa fa-paint-brush"></i> Badge Color',
												  'control_type' => 'colorpicker', // 'color' for HTML5 color input
												  'attributes' => array(
													'placeholder' => '#123ABC',
												  ),
												  'on' => array(),
												), 		
								 'title' => array(
														  'label' => '<i class="fa fa-font"></i> Title',
														  'control_type' => 'text',
														  'attributes' => array(
															// 'class' => '',
															'placeholder' => 'Item Title',
															// 'pattern' => '', // regex for validation
														  ),
														  'on' => array(
															'focus' => 'function(){ $(this).select(); }',
														  ),
														), 	
								'description' => array(
												  'label' => '<i class="fa fa-align-left"></i> Edit Description',
												  'control_type' => 'ck_editor',
												  'attributes' => array(
													// 'class' => '',
													// 'placeholder' => 'A short description',
												  ),
												  'on' => array(),
												), 
								'available' => array(
														  'label' => '<i class="fa fa-truck"></i> Available',
														  'control_type' => 'select',
														  'options' => array( 
															// option value => option text
															'in stock' => 'in stock',
															'available short-term' => 'short-term', 
															'available long-term' => 'long-term', 
															'available on request' => 'on request', 
															'sold out' => "sold out", 
														  ),
														  'attributes' => array(),
														  'on' => array(),
														), 	
								 'price' => array(
														  'label' => '<i class="fa fa-dollar"></i> Price',
														  'control_type' => 'number',
														  'attributes' => array(
															// 'class' => '',
															'step' => 'any',
															'placeholder' => '00.00',
															// 'pattern' => '', // regex for validation
														  ),
														  'on' => array(
															'focus' => 'function(){ $(this).select(); }',
														  ),
														), 														
									    'button_text' => array(
												  'label' => '<i class="fa fa-cc-stripe"></i> Button Text',
												  'control_type' => 'text',
												  'attributes' => array(
													// 'class' => '',
													'placeholder' => 'Click me!',
													// 'pattern' => '', // regex for validation
												  ),
												  'on' => array(
													'focus' => 'function(){ $(this).select(); }',
												  ),
												), 
									
									
									
									
							
				),
			'attributes' => array(),
		),
	),


);
