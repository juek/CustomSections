<?php 
/*
#############################################################################################
Author: J. Krausz and a2exfr
Date: 2016-11-28
Version 1.0b1
#############################################################################################
*/


defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts' => false,  // use a custom editor Javascript for this section type?
  'custom_css' =>     false,  // use a custom editor CSS for this section type?
  'modules' =>        false,  // when using custom editor script(s), we use this to load modules like ck_editor, colorpicker, clickpicker, datepicker
                              // the modules value can be a string 'ck_editor', a csv 'ck_editor,colorpicker' or an array('ck_editor','colorpicker');
                              // with the universal editor, we do not need to set this value, because modules will be loaded with the control_type values
  
  //*disabled */ 'js_on_content' => 'console.log( "js_on_content, JavaScript code defined in _types/shop_item/editor.php was executed: Editing section id = " + gp_editor.edit_section.attr("id") + " | Timestamp: " + new Date().toJSON() )',  
      // javascript code to be executed when the currently edited section is updated. Use e.g. for re-initing something.
   
     /*---------------------------------------------*/
  /*        							        */ 
 /*   			BUNCH CONTROL DEMO			   */
  /*        							        */
  /*---------------------------------------------*/
   
  'controls' => array( 
  
	'tabs' => array(
      'label' => '<i class="fa fa-file-text-o"></i> Tab',
      'control_type' => 'bunch_control',
	  'sub_controls'=>array(
								'title' => array('label' => 'Title', 'control_type' => 'text',),
								'tab_content' => array('label' => 'Content', 'control_type' => 'ck_editor',),

								),
      'attributes' => array(),

    ), 




  ),
);