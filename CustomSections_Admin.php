<?php
/*
###########################################################################
PHP admin class for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
###########################################################################
*/

defined('is_running') or die('Not an entry point...');

class CustomSections_Admin {


	function __construct(){
		$this->CommandHandle();
		$this->ShowHeader();
		$this->GetSectionTypes();
		$this->ShowForm();
	}



	function CommandHandle(){
	 	$cmd = common::GetCommand();
		switch($cmd){
				case 'toggle_section':
					$this->Toggle_section();
					break;
				case 'recreate_custom_sections':
					$this->GetSectionTypes();
					$this->Recreate_custom_sections();
					break;
				default:
		}
	}



	function ShowHeader(){
		global $config;
		$addon_ver = false;
		foreach ($config['addons'] as $addon_key => $addon_info) {
			if( $addon_info['name'] == 'CustomSections' ){
				$addon_ver = $addon_info['version'];
			}
		}
		if( $addon_ver ){
			echo '<p style="float:right;">Version ' . $addon_ver . '</p>';
		}
		echo '<h2 class="hmargin_tabs">Custom Sections &raquo; Settings</h2>';
	}



	function GetSectionTypes(){
		global $addonPathCode;
		$this->sections = \gp\tool\Files::ReadDir($addonPathCode . '/_types/', 1);
	}



	function ShowForm(){
		echo '<table class="bordered" style="width:100%;">';
		echo '<tr><th>Section Type</th><th>Toggle</th></tr>';

		foreach ($this->sections as $type){

			$type_enabled = (strpos($type, '!') !== 0);
			$type_label = $type_enabled
				? str_replace("!", "", $type)
				: '<del>' . str_replace("!", "", $type) . '</del>';
			$toggle_link = '<a style="text-decoration:none; color:inherit;" '
				. 'href="' . common::GetUrl('Admin_CustomSections').'?cmd=toggle_section&type=' . $type . '">'
				. '<i class="fa fa-toggle-' . ($type_enabled ? 'on' : 'off') . '"></i></a>';

			echo  '<tr>';
			echo    '<td>' . $type_label . '</td>';
			echo    '<td>' . $toggle_link . '</td>';
			echo  '</tr>';
		}

	echo '</table>';
	}



	function Toggle_section(){
		global $addonPathCode;
		
		$old_name=$_REQUEST['type'];
		if(  strpos($old_name, '!') !== 0 ){ 
			$new_name= "!".$old_name;
		} else {
			$new_name= str_replace("!", "", $old_name);
		}
		$new_dir = $addonPathCode . '/_types/' . $new_name ;
		$old_dir = $addonPathCode . '/_types/' . $old_name ;

		if( !@rename($old_dir, $new_dir) ){
			msg(
			'Error renaming directory [CustomSections]/_types/' 
			. $old_name 
			. '. <br/>Check permissions or rename it manually.'
			);
		}
		return;
	}



	function Recreate_custom_sections(){
		includeFile('tool/SectionContent.php');
		$title = $_REQUEST['page_to_refresh'];
		$page_file = \gp\tool\Files::PageFile($title);
		$draft_file = dirname($page_file) . '/draft.php';
		if( !file_exists($page_file) ){
			return;
		}
		$file = file_exists($draft_file) ? $draft_file : $page_file;
		$file_sections = $file_stats = array();
		// ob_start();
		include($file);
		// ob_get_clean();
		$i = 0;
		if( is_array($file_sections) ){
			foreach ($file_sections as $key => $val) {
				if( array_key_exists($val['type'],$this->sections) ){ 
					$section_options = array('type' => $val['type'], 'values' => $val['values'],);
					$sc = \gp\tool\Output\Sections::SectionToContent($section_options, '');
					$file_sections[$key]['content']=$sc;
					$i++;
				}
				if( $i > 0 ){
					\gp\tool\Files::SaveData($file, 'file_sections', $file_sections);
				}
			}
		}

		msg($i .' Custom Sections have been recreated! Redirecting back to <a href="' . common::GetUrl($title) . '">' . $title . '</a> in 5 seconds!' );

		header('Refresh:5; url='.common::GetUrl($title));
	}

}
