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
		foreach ($config['addons'] as $addon_key => $addon_info) {
		  if ($addon_info['name'] == 'CustomSections') {
			$addon_vers = $addon_info['version'];
				  
		  }
		}
		echo '<h3>Custom Sections</h3>';
		echo'<h5>version '.$addon_vers.'</h5>';
		
	}
	
	function GetSectionTypes(){
		global $addonPathCode;
		$this->sections = gp\tool\Files::ReadDir($addonPathCode . '/_types/', 1);
	}
	
	function ShowForm(){
		echo '<table class="bordered" style="width:100%;">';
		  echo '<tr><th>Section type</th><th>Toggle Usage</th></tr>';
		foreach ($this->sections as $type){
			
			if(  strpos($type, '!') !== 0 ){ 
			$line = str_replace("!", "", $type);
			 $use = '<a style="text-decoration:none; color:inherit;" href="'.common::GetUrl('Admin_CustomSections').'?cmd=toggle_section&type='.$type.'"><i class="fa fa-toggle-on"></i></a>';
			 
			} else {
			$line = '<del>'.str_replace("!", "", $type).'</del>';
			 $use='<a style="text-decoration:none; color:inherit;" href="'.common::GetUrl('Admin_CustomSections').'?cmd=toggle_section&type='.$type.'"><i class="fa fa-toggle-off"></i></a>';
			}
			
			echo '<tr>';
			echo '<td><p>'.$line.'</p> </td>';
			
			echo '<td><p>'.$use.'</p> </td>';
			echo '</tr>';
					
			
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
		$new_name = $addonPathCode . '/_types/' . $new_name ;
		$old_name = $addonPathCode . '/_types/' . $old_name ;
		 
		if (!rename (  $old_name ,  $new_name )){
			msg("Do not work, use manuall toggle");
		}
		return;
	}

	
	function Recreate_custom_sections(){
		includeFile('tool/SectionContent.php');
		$title=$_REQUEST['page_to_refresh'];
		$file = gpFiles::PageFile($title);
		if (!file_exists($file)) {
            return;
        }
		$file_sections = $file_stats = array();
        ob_start();
        include($file);
        ob_get_clean();
        if (!is_array($file_sections)) {
			msg("No section to recreate!");
			return;
        }
		
		$i=0;
		foreach ($file_sections as $key => $val) {
			if( array_key_exists($val['type'],$this->sections) ){ 
				$section_options = array('type' => $val['type'],'values' => $val['values'],);
				$sc = \gp\tool\Output\Sections::SectionToContent($section_options, '');
				$file_sections[$key]['content']=$sc;
				$i++;
			}
		}
		
	gp\tool\Files::SaveData($file, 'file_sections', $file_sections);
	
	msg($i .' - Custom sections was refreshed! Redirecting to <a href="'.common::GetUrl($title).'"> page </a> in 5 seconds!'  );
	
	header('Refresh:5; url='.common::GetUrl($title));
	}
	
}