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

  static $custom_types = false;   // will be set at first call of SectionTypes()
  static $debug_level = 2;        // 0 = silence, 1 = only error/warning msgs, 2 = msgs for current debugging , 3 = level-3 messages, also write debug files to $addonPathCode/!debug/*.php (needs write permissions!)
  static $debug_counter = 0;      // to prevent stripping of duplicate messages


  static function SectionTypes( $section_types=array() ){

    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ self::$debug_counter++; msg('SectionTypes - fn call (' . self::$debug_counter . ')'); }

    if( self::$custom_types ){
      /* DEBUG level 3 */ if( self::$debug_level > 2 ){ self::$debug_counter++; msg('SectionTypes - using static $custom_types (' . self::$debug_counter  .')'); }
      $section_types += self::$custom_types;
      return $section_types;
    }
    global $addonRelativeCode, $addonPathCode, $addonPathData;
    $types_cache = $addonPathData . '/types.php';

    if( \gp\tool::LoggedIn() || !file_exists($types_cache) ){
      $types = array();
      $sections = gp\tool\Files::ReadDir($addonPathCode . '/_types/', 1);
      foreach( $sections as $type ){
        $section_file = $addonPathCode . '/_types/' . $type . '/section.php';
        if( file_exists($section_file) && strpos($type, '!') !== 0 ){
          // needed to avoid warnings -start
          $sectionRelativeCode = $addonRelativeCode . '/_types/' . $type;
          $sectionCurrentValues = array();
          // needed to avoid warning --end
          include $section_file;
          if( isset($section) ){
            $types[$type] = array( 
              'label' => ( !empty($section['gp_label']) ? $section['gp_label'] : ucwords(str_replace("_", " ", $type)) ) 
            );
          }
        }
      }
      \gp\tool\Files::SaveData($types_cache, 'types', $types);
      /* DEBUG level 3 */ if( self::$debug_level > 2 ){ self::$debug_counter++; msg('SectionTypes - writing cache file (' . self::$debug_counter . ')'); }

    }else{
      include $types_cache;
      /* DEBUG level 3 */ if( self::$debug_level > 2 ){ self::$debug_counter++; msg('SectionTypes - loading cache file (' . self::$debug_counter  .')'); }
    }

    self::$custom_types = $types;
    $section_types += $types;

    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ msg("section_types=" . pre($section_types)); }
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
      // load components required for editing
      if( \gp\tool::LoggedIn() ){
        $editor_file = $addonPathCode . '/_types/' . $type . '/editor.php';
        if( file_exists($editor_file) ){
          include($editor_file);
          foreach( $editor['controls'] as $control => $control_arr ){
            if( !empty($control_arr['components']) ){
              \gp\tool::LoadComponents($control_arr['components']); 
            }
          }
        }
      }
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
        'content' => '<h2>Error: Section file for type <em>' . $type . '</em> is not defined!</h2>',
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
     
     // one level array elements echo syntax {{array|key}}
     if( is_array($val) ){
       foreach( $val as $sub_key => $sub_val ){
        if( is_array($sub_val) ){
          continue; // we don't deal with multi-dimensional arrays
        }
        $search[] =  '{{' . $key . '|' . $sub_key . '}}';
        $replace[] =  $sub_val;
       }
     }else{    
      $search[] =   '{{' . $key . '}}';
      $replace[] =  $val;
     }
   }
    $current_section['content'] = str_replace($search, $replace, $section['content']);
    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/!debug/current_section.php', 'current_section', $current_section); }
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
      if( \gp\tool::LoggedIn() || !empty($section_data['always_process_values']) ){
        return self::GetSection($section_data);
      }
    }
    return $section_data;
  }



  static function NewSections($links){
    global $addonRelativeCode;
    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/!debug/debug_NewSections.php','links',$links); }
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
      $page->file_sections[$section]['content'] = & $_POST['gpcontent'];
      return true;
    }
    return $return;
  }



  static function InlineEdit_Scripts($scripts, $type){
    global $addonRelativeCode, $addonPathCode, $addonFolderName, $addonCodeFolder;
    $section_types = self::SectionTypes();  
    if( !array_key_exists($type, $section_types) ){ 
      return $scripts;
    }

    include $addonPathCode . '/_types/' . $type . '/editor.php';

    $css = array();
    if( !empty($editor['custom_css']) ){
      if( is_array($editor['custom_css']) ){
        // array of css files
        foreach( $editor['custom_css'] as $css_file ){
          $css[] = $addonRelativeCode . '/_types/' . $type . '/' . $css_file;
        }
      }else{
        // single css file
        $css[] = $addonRelativeCode . '/_types/' . $type . '/' . $editor['custom_css'];
      }
    }else{
      $css[] = $addonRelativeCode . '/universal_editor/editor.css';
    }

    $modules = array();
    // modules defined in $editor array
    if( !empty($editor['modules']) ){
      if( is_array($editor['modules']) ){
        $modules = $editor['modules'];
      }else{ 
        // is single value or csv
        $modules = explode(',', $editor['modules']);
      }
    }

    // modules defined in controls
    foreach( $editor['controls'] as $control ){
      switch( $control['control_type'] ){
        case 'ck_editor':
          $modules[] = 'ck_editor';
          break;
        case 'colorpicker': // for rgba
          $modules[] = 'colorpicker';
          break;
        case 'clockpicker':
        case 'datetime-combo':
        case 'multi-date':
          $modules[] = 'clockpicker';
          break;
        case 'link-field':
          $modules[] = 'link-field';
          break;
        //case 'datepicker':
        //  $modules[] = 'datepicker';
        //  break;
      }
    }

    if( !empty($modules) ){
      $modules = array_unique($modules);
      $get_modules = self::GetEditorModules($modules, $scripts, $css); // returns array( 'scripts' => $scripts, 'css' => $css )
      $scripts = $get_modules['scripts'];
      $css = $get_modules['css'];
    }

    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/!debug/modules.php','modules',$modules); }
    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/!debug/css.php','css',$css); }
    
    $code = 'var CustomSections_editor = { ';
    $code .=  'base : "' . $addonRelativeCode . '", ';
    if( empty($editor['custom_scripts']) ){
      $code .= 'controls : ' . json_encode($editor['controls']) . ', ';
    }
    if( !empty($editor['js_on_content']) ){
      $code .=  'js_on_content : ' . json_encode($editor['js_on_content']) . ', ';
    }
    $code .=  'css : ' . json_encode($css) . ', ';
    $code .=  'debug_level : "' . self::$debug_level . '", ';

    $code .= ' };';
    $scripts[] = array( 'code' => $code );

    if( !empty($editor['custom_scripts']) ){
      if( is_array($editor['custom_scripts']) ){
        // array of script files
        foreach( $editor['custom_scripts'] as $js_file ){
          $scripts[] = $addonRelativeCode . '/_types/' . $type . '/' . $js_file;
        }
      }else{
        // single script file
        $scripts[] = $addonRelativeCode . '/_types/' . $type . '/' . $editor['custom_scripts'];
      }
    }else{
      $scripts[] = $addonRelativeCode . '/universal_editor/editor.js';
    }
    /* DEBUG level 3 */  if( self::$debug_level > 2 ){ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/!debug/scripts.php','scripts',$scripts); }
    return $scripts;
  }



  static function GetEditorModules($modules, $scripts, $css){
    global $addonRelativeCode;
    foreach( $modules as $module ){
      $module = trim($module); // remove possible spaces left from exploding csv
      switch( $module) {
        case 'ck_editor':
          // ckeditor basepath and configuration
          $options = array();
          $ckeditor_basepath = \gp\tool::GetDir('/include/thirdparty/ckeditor_34/');
          $scripts[] = array( 'code' => 'CKEDITOR_BASEPATH = ' . gpAjax::quote($ckeditor_basepath) . '; ' ); 
          $scripts[] = array( 'code' => 'var CS_ckconfig = ' . gp_edit::CKConfig($options, 'json', $plugins) . '; ');
          // extra plugins
          echo 'var gp_add_plugins = ' . json_encode( $plugins ) . ';';
          $scripts[] = '/include/thirdparty/ckeditor_34/ckeditor.js';
          $scripts[] = '/include/js/ckeditor_config.js';
          break;

        case 'colorpicker':
          $scripts[] = $addonRelativeCode . '/thirdparty/bootstrap_colorpicker/bootstrap-colorpicker.min.js';
          $css[] = $addonRelativeCode . '/thirdparty/bootstrap_colorpicker/bootstrap-colorpicker.css';
          break;

        case 'clockpicker':
          $scripts[] = $addonRelativeCode . '/thirdparty/jquery_clockpicker/jquery-clockpicker.min.js';
          $css[] = $addonRelativeCode . '/thirdparty/jquery_clockpicker/jquery-clockpicker.min.css';
          break;

        case 'link-field':
          $scripts[] = array( 'code' => \gp\tool\Editing::AutoCompleteValues(true) );
          break;
      }
    }
    return array( 'scripts' => $scripts, 'css' => $css );
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
  
