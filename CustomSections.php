<?php
/*
###########################################################################
PHP class for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-11-28
Version 1.0b1
###########################################################################
*/

defined('is_running') or die('Not an entry point...');


class CustomSections {

  static function SectionTypes( $section_types=array() ){
	global $addonPathCode;
	$sections=gp\tool\Files::ReadDir($addonPathCode . '/_types/',1);
	foreach($sections as $type){
		$section_file = $addonPathCode . '/_types/' . $type . '/section.php';	
		  if( file_exists($section_file) ){
				include $section_file;
				if (array_key_exists('gp_label',$section)){
					$section_types[$type] = array( 'label' => $section['gp_label'] );
				} else {
					$section_types[$type] = array( 'label' => $type );
				}
		  }
	}
	
    return $section_types;
  }



  static function GetHead(){
    // global $page, $addonRelativeCode;
    // if( \gp\tool::LoggedIn() ){}
    // $page->head_js[] =   $addonRelativeCode . '/.js';
    // $page->css_user[] =  $addonRelativeCode . '/.css';
    self::LoadSectionCssJs();
  }



  static function LoadSectionCssJs(){
    global $page, $addonPathCode, $addonRelativeCode;
    $types = self::SectionTypes();
    foreach( $types as $type => $type_arr ){
      $section_file = $addonPathCode . '/_types/' . $type . '/section.php';
      if( file_exists($section_file) ){
        // needed to avoid warnings -start
        $sectionRelativeCode = $addonRelativeCode . '/_types/' . $type;
        $sectionCurrentValues = array();
        // needed to avoid warning --end
        include $section_file;
        if( !empty($components) ){
          if( strpos($components, 'colorbox') !== false ){
            \gp\tool::AddColorBox();
          }
          \gp\tool::LoadComponents($components); 
        }
        if( !empty($css_files) ){
          if( is_array($css_files) ){
            foreach($css_files as $css_file){
              $page->css_user[] = $addonRelativeCode . '/_types/' . $type . '/' . $css_file;
            }
          }else{
            $page->css_user[] = $addonRelativeCode . '/_types/' . $type . '/' . $css_files;
          }
        }
        if( !empty($style) ){
          $page->head .= "\n<!-- from Custom Section [" . $type . "]: -->\n<style>" . $style . "</style>\n"; 
        }
        if( !empty($js_files) ){
          if( is_array($js_files) ){
            foreach($js_files as $js_file){
              $page->head_js[] = $addonRelativeCode . '/_types/' . $type . '/' . $js_file;
            }
          }else{
            $page->head_js[] = $addonRelativeCode . '/_types/' . $type . '/' . $js_files;
          }
        }
        if( !empty($javascript) ){
          $page->head_script .= "\n<!-- from Custom Section [" . $type . "]: -->\n" . $javascript . "\n";
        }
        if( !empty($jQueryCode) ){
          $page->jQueryCode .= "\n/* -- from Custom Section [" . $type . "]: */\n" . $jQueryCode . "\n"; 
        }
      }
      unset($components, $css_files, $style, $js_files, $javascript, $jQueryCode);
    }
  }

  
  
  static function GetSection($current_section){
    // to get a default section, passin $current_section only with 'type' defined
    global $addonPathCode, $addonRelativeCode;
    if( empty($current_section['type']) ){
       return array(
        'type' => 'text',
        'content' => '<h2>Error: No section type passed!</h2>',
        'gp_label' => 'Error', 'gp_color' => '#D32625',
        'attributes' => array( 'class' => 'alert alert-danger' ),
      );
    }
    $type = $current_section['type'];
    // load section definition file
    $section_file = $addonPathCode . '/_types/' . $type . '/section.php';
    if( !file_exists($section_file) ){
      // if file is missing, return a text section with error msg
      return array(
        'type' => 'text',
        'content' => '<h2>Error: Section file for type <em>' . $type . '</em> in dot defined!</h2>',
        'gp_label' => 'Error', 'gp_color' => '#D32625',
        'attributes' => array( 'class' => 'alert alert-danger' ),
      );
    }
    $sectionRelativeCode = $addonRelativeCode . '/_types/' . $type;
    $sectionCurrentValues = !empty($current_section['values']) ? $current_section['values'] : array();

    include $section_file;

    // union $current_section with loaded $section -> this only overwrites undefined keys in $current_section
    $current_section += $section;
    
    // replace content values
    $search = array();
    $replace = array();
    foreach( $sectionCurrentValues as $key => $val ){
      $search[] =   '{{' . $key . '}}';
      $replace[] =  $val;
    }
    $current_section['content'] = str_replace($search, $replace, $section['content']);
    //* DEBUG */ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/current_section.php', 'current_section', $current_section);
    return $current_section;
  }




  static function DefaultContent($default_content, $type){
    $section_types = self::SectionTypes();  
    if( array_key_exists($type, $section_types) ){ 
      return self::GetSection(array('type'=>$type));
    }
    return $default_content;
  }




  static function SectionToContent($section_data){
    $section_types  = self::SectionTypes();
    if( array_key_exists($section_data['type'], $section_types) ){ 
      return self::GetSection($section_data);
    }
    return $section_data;
  }



  static function NewSections($links){
    global $addonRelativeCode;
    //* DEBUG */ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/debug_NewSections.php','links',$links);
    $section_types  = self::SectionTypes(); 
    foreach( $links as $key => $section_type_arr ){
      $type = $section_type_arr[0];
      if( !is_array($type) && array_key_exists($type, $section_types) ){
        $links[$key] = array($type, $addonRelativeCode . '/_types/' . $type . '/ui_icon.png');
      }
    }
    return $links;
  }
 


  static function SaveSection($return, $section, $type){
    $section_types = self::SectionTypes();
    if( array_key_exists($type, $section_types) ){ 
      global $page;
      $page->file_sections[$section]['values'] = & $_POST['values'];
      return true;
    }
    return $return;
  }



  static function InlineEdit_Scripts($scripts, $type){
    global $addonRelativeCode, $addonPathCode, $addonFolderName, $addonCodeFolder;
    $section_types = self::SectionTypes();  
    if( array_key_exists($type, $section_types) ){ 
      include $addonPathCode . '/_types/' . $type . '/editor.php';

      /* 
      // we don't need this anymore since there is (boolean)already_prefixed in $gp.LoadStyle since TS 5
      $addonBasePath = (strpos($addonRelativeCode, 'addons/') > 0) 
        ? '/addons/' . $addonFolderName 
        : '/data/_addoncode/' . $addonFolderName;
      $editor_css = $editor['custom_css'] != false ? $addonBasePath . '/_types/' . $type . '/' . $editor['custom_css'] : $addonBasePath . '/universal_editor/editor.css' ;
      */

	  
	  foreach ($editor['controls'] as $field) {
		  if($field['control_type'] == "ck_editor"){
				// ckeditor basepath and configuration
				$options = array();
				$ckeditor_basepath = common::GetDir('/include/thirdparty/ckeditor_34/');
				echo 'CKEDITOR_BASEPATH = ' . gpAjax::quote($ckeditor_basepath) . '; ';
				echo 'var CS_ckconfig = ' . gp_edit::CKConfig($options, 'json', $plugins) . '; ';
				// extra plugins
			//	echo 'var gp_add_plugins = ' . json_encode( $plugins ) . ';';
				$scripts[] = '/include/thirdparty/ckeditor_34/ckeditor.js';
				$scripts[] = '/include/js/ckeditor_config.js';
				break;
		 }
		  
	  }
	  
	  	  
	  
      $editor_css = $editor['custom_css'] != false ? $addonRelativeCode . '/_types/' . $type . '/' . $editor['custom_css'] : $addonRelativeCode . '/universal_editor/editor.css' ;
      $code = 'var CustomSections_editor = { ';
      $code .=  'base : "' . $addonRelativeCode . '", ';
      $code .=  'editor_css : "' . $editor_css . '"';
      if( $editor['custom_script'] == false ){
        $code .= ', controls : ' . json_encode($editor['controls']);
      }
      $code .= ' };';
      $scripts[] = array( 'code' => $code );

      $editor_script = $editor['custom_script'] != false ? $addonRelativeCode . '/_types/' . $type . '/' . $editor['custom_script'] : $addonRelativeCode . '/universal_editor/editor.js' ;
      $scripts[] = $editor_script;
    }
    return $scripts;
  }

  
  
  static function PageRunScript($cmd) {
    global $page; 
    if( $cmd != 'save_custom_section' ){
      return $cmd;
    }
    $page->ajaxReplace = array();
    $values = & $_REQUEST['values'];
    $type = & $_REQUEST['type'];
    $section_options = array(
      'type' => $type, 
      'values' => $values,
    );
    $arg_value = \gp\tool\Output\Sections::SectionToContent($section_options, '');
    $page->ajaxReplace[] = array('updateContent', 'arg', $arg_value);
    return 'return';
  } 

}
  
