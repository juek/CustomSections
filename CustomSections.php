<?php
/*
###########################################################################
PHP class for Typesetter CMS developer plugin - 'Custom Sections'
Author: J. Krausz and a2exfr
Date: 2016-12-12
Version 1.0b2
###########################################################################
*/

defined('is_running') or die('Not an entry point...');


class CustomSections {

  public static $debug_level = 1;             // 0 = silence, 1 = errors/warnings, 2 = verbose, 3 = also write debug files to $addonPathCode/!debug/*.php (needs write permissions!)
  public static $debug_counter = 0;           // to prevent stripping of duplicate messages
  public static $custom_types = false;        // will be set at first call of SectionTypes()
  public static $defined_components = false;  // will be set at first call of getDefinedComponents()
  public static $extra_controls = false;      // will be set at first call of LoadSectionCssJs()->getEditorComponents($type)
  public static $i18n = false;                // possible internationalization (i18n) array of terms, based on Admin UI language or Multi-Language Manager page language if installed

  public static function SectionTypes( $section_types=array() ){
    global $addonRelativeCode, $addonPathCode, $addonPathData;

    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ self::$debug_counter++; msg('SectionTypes - fn call (' . self::$debug_counter . ')'); }

    if( self::$custom_types ){
      /* DEBUG level 3 */ if( self::$debug_level > 2 ){ self::$debug_counter++; msg('SectionTypes - using public static $custom_types (' . self::$debug_counter  .')'); }
      $section_types += self::$custom_types;
      return $section_types;
    }

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



  public static function GetHead(){
    // global $page, $addonRelativeCode;
    // if( \gp\tool::LoggedIn() ){}
    // $page->head_js[] =   $addonRelativeCode . '/.js';
    // $page->css_user[] =  $addonRelativeCode . '/.css';
    self::LoadSectionCssJs();
  }



  public static function LoadSectionCssJs(){
    global $page, $addonPathCode, $addonRelativeCode;
    $types = self::SectionTypes();
    foreach( $types as $type => $type_arr ){
      $section_file = $addonPathCode . '/_types/' . $type . '/section.php';
      if( file_exists($section_file) ){
        self::setLanguage($type);
        // load components required for editing
        if( \gp\tool::LoggedIn() ){
          $editor_components = self::getEditorComponents($type);
          $ts_components = $editor_components['ts_components']; // already 'stringified'
          if( !empty($ts_components) ){
            \gp\tool::LoadComponents($ts_components); 
          }
        }
        // needed to avoid warnings -start
        $sectionRelativeCode = $addonRelativeCode . '/_types/' . $type;
        $sectionCurrentValues = array();
        // needed to avoid warning --end
        include $section_file;
        // load components required at user runtime
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
          $page->head_script .= "\n/* from Custom Section [" . $type . "]: */\n" . $javascript . "\n";
        }
        if( !empty($jQueryCode) ){
          $page->jQueryCode .= "\n/* from Custom Section [" . $type . "]: */\n" . $jQueryCode . "\n"; 
        }
      }
      unset($components, $css_files, $style, $js_files, $javascript, $jQueryCode);
    }
  }

  
  
  public static function GetSection($current_section){
    // to get a default section, passin $current_section only with 'type' defined
    global $addonPathCode, $addonRelativeCode;
    if( empty($current_section['type']) ){
       return array(
        'type' => 'text',
        'content' => '<h2>Error: No section type passed!</h2>',
        'gp_label' => 'Error', 
        'gp_color' => '#D32625',
        'attributes' => array( 
          'class' => 'alert alert-danger' 
         ),
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
        'gp_label' => 'Error', 
        'gp_color' => '#D32625',
        'attributes' => array( 
          'class' => 'alert alert-danger' 
        ),
      );
    }
    self::setLanguage($current_section['type']);
    $sectionRelativeCode = $addonRelativeCode . '/_types/' . $type;
    $sectionCurrentValues = !empty($current_section['values']) ? $current_section['values'] : array();
  
    //bucnh-control support
    foreach($sectionCurrentValues as $key =>$value){
      if( is_array($value) ){ 
        if( array_key_exists('bunch_control_order', $value) ){
          unset ($sectionCurrentValues[$key]['bunch_control_order']); 
        }
      }
    }
  
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




  public static function DefaultContent($default_content, $type){
    $section_types = self::SectionTypes();  
    if( array_key_exists($type, $section_types) ){ 
      return self::GetSection(array('type'=>$type, 'is_new'=>true));
    }
    return $default_content;
  }




  public static function SectionToContent($section_data){
    $section_types  = self::SectionTypes();
    if( array_key_exists($section_data['type'], $section_types) ){
      if( \gp\tool::LoggedIn() || !empty($section_data['is_new']) || !empty($section_data['always_process_values']) ){
        return self::GetSection($section_data);
      }
    }
    return $section_data;
  }




  public static function NewSections($links){
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

 


  public static function SaveSection($return, $section, $type){
    $section_types = self::SectionTypes();
    if( array_key_exists($type, $section_types) ){ 
      global $page;
      $page->file_sections[$section]['values'] = & $_POST['values'];
      unset($page->file_sections[$section]['is_new']);
      if( !empty($_POST['attributes']) && is_array($_POST['attributes']) ){
        $page->file_sections[$section]['attributes'] = & $_POST['attributes'];
      }
      $page->file_sections[$section]['content'] = & $_POST['gpcontent'];
      return true;
    }
    return $return;
  }




  public static function PageRunScript($cmd) {
    global $page, $addonPathCode, $addonRelativeCode, $addonPathData, $addonRelativeData; 
    //msg('CustomSections::PageRunScript - $cmd = ' .$cmd );
    if( isset($_REQUEST['cmd']) && $_REQUEST['cmd'] == 'custom_sections_cmd' && !empty($_REQUEST['type']) ){
      $type = htmlspecialchars($_REQUEST['type']);
      $script_file = $addonPathCode . '/_types/' . $type . '/script.php';
      // msg('$script_file = ' . $script_file );
      if( file_exists($script_file) ){
        $types = self::SectionTypes();
        if( array_key_exists($type, $types) ){
          self::setLanguage($type);
          $sectionRelativeCode  = $addonRelativeCode . '/_types/' . $type;
          $sectionRelativeData  = $addonRelativeData . '/_types/' . $type;
          $sectionPathCode      = $addonPathCode . '/_types/' . $type;
          $sectionPathData      = $addonPathData . '/' . $type;
          include $script_file;
        }else{
          msg("Custom Sections Error: Bad type request <em>" . $type . "</em>");
        }
      }
    }

    if( \gp\tool::LoggedIn() && \gp\admin\Tools::HasPermission('Admin_CustomSections') ){
      $page->admin_links[] = array(
        common::GetUrl('Admin_CustomSections'),  
        '<i class="fa fa-refresh"></i>', 
        'cmd=recreate_custom_sections&page_to_refresh=' . $page->title, 
        'title="Recreate Custom Sections"'
      );
    }
    
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
    if( isset($_REQUEST['attributes']) ){
      // msg("Section attributess = " . pre( $_REQUEST['attributes']) );
      $section_options['attributes'] = $_REQUEST['attributes'];
    }
    $arg_value = \gp\tool\Output\Sections::SectionToContent($section_options, '');
    $page->ajaxReplace[] = array('updateContent', 'arg', $arg_value);
    return 'return';
  }




  public static function InlineEdit_Scripts($scripts, $type){
    global $addonRelativeCode, $addonPathCode, $addonFolderName, $addonCodeFolder;
    $section_types = self::SectionTypes();  
    if( !array_key_exists($type, $section_types) ){ 
      return $scripts;
    }
    self::setLanguage($type);
    $editor_file = $addonPathCode . '/_types/' . $type . '/editor.php';
    if( !file_exists($editor_file) ){
      $scripts[] = array( 'code' => 'alert(\'Custom Sections Error: Editor definition file for type ' . $type .  ' was not found!\')' );
      return $scripts;
    }
    include $editor_file;

    $editor_components = self::getEditorComponents($type); // returns array( 'ts_components' => (string)csv of Typesetter components, 'scripts' => array( scripts ), 'css' => array( files ) )
    $editor_lang = self::$i18n['editor']['lang'];
    $editor_css = $editor_components['css'];
    $editor_scripts = $editor_components['scripts'];

    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/!debug/editor_components.php','editor_components', $editor_components); }
    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/!debug/css.php','css',$css); }
    
    $code = 'var CustomSections_editor = { ';
    $code .=  'base : "' . $addonRelativeCode . '", ';
    if( empty($editor['custom_scripts']) ){
      $code .= 'controls : ' . json_encode($editor['controls']) . ', ';
    }
    if( !empty($editor['js_on_content']) ){
      $code .=  'js_on_content : ' . json_encode($editor['js_on_content']) . ', ';
    }
    $code .=  'css : ' . json_encode($editor_css) . ', ';
    $code .=  'lang : ' . json_encode($editor_lang) . ', ';
    $code .=  'extensions : {}, ';
    $code .=  'debug_level : "' . self::$debug_level . '" ';

    $code .= ' };';
    $scripts[] = array( 'code' => $code );
    
    foreach( $editor_scripts as $script ){
      //if( count($scripts) < count($editor_scripts)+1 ){
        $scripts[] = $script;
      //}else{
        // last key
        // $scripts[] = array(
        //  'object' => 'gp_editing',
        //  'file' => $script,
        // );
      // }
    }

    /* DEBUG level 2 */  if( self::$debug_level > 1 ){ global $addonPathCode; \gp\tool\Files::SaveData($addonPathCode.'/!debug/scripts.php','scripts',$scripts); }
    return $scripts;
  }




  public static function getEditorComponents($type){
    global $addonPathCode, $addonRelativeCode ;
    $editor_file = $addonPathCode . '/_types/' . $type . '/editor.php';
    if( !file_exists($editor_file) ){
      return array( 'ts_components' => '', 'scripts' => array(), 'css' => array() );
    }

    include $addonPathCode . '/_types/' . $type . '/editor.php';
    $ts_components = array(); // will be used in GetHead to load Typesetter Components like datepicker
    $scripts = array();
    $css = array();

    $components = array();
    // load extra controls
    $extra_controls = self::getExtraControls();
    /* DEBUG level 2 */  if( self::$debug_level > 2 ){ msg("getExtraControls() called from getEditorComponents('" . $type . "'): " . pre($extra_controls)); }

    // editor_components defined in $editor array
    if( !empty($editor['editor_components']) ){
      if( is_array($editor['editor_components']) ){
        $components = $editor['editor_components'];
      }else{ 
        // is single value or csv
        $components = explode(',', $editor['editor_components']);
        $components = array_map('trim', $editor_components);
      }
    }
    // editor_components defined in controls
    foreach( $editor['controls'] as $control ){
      $control_type = $control['control_type'];
      // controls existing in universal_editor
      switch( $control_type ){
        case 'ck_editor':
          $components[] = 'ckeditor';
          break;
        case 'colorpicker': // for rgba
          $components[] = 'colorpicker';
          break;
        case 'clockpicker':
          $components[] = 'clockpicker';
          break;
        case 'datepicker':
          $components[] = 'datepicker';
          break;
        case 'datetime_combo':
          $components[] = 'clockpicker';
          $components[] = 'datepicker';
          break;
        case 'link_field':
          $components[] = 'autocomplete_pages';
          break;   
        case 'bunch_control':
          foreach ($control['sub_controls'] as $sub_control){
            $type=$sub_control['control_type'];
            switch( $type ){
              case 'ck_editor':
                $components[] = 'ckeditor';
                break;
              case 'colorpicker': // for rgba
                $components[] = 'colorpicker';
                break;
              case 'clockpicker':
                $components[] = 'clockpicker';
                break;
              case 'datepicker':
                $components[] = 'datepicker';
                break;
              case 'datetime_combo':
                $components[] = 'clockpicker';
                $components[] = 'datepicker';
                break;
              case 'link_field':
                $components[] = 'autocomplete_pages';
                break;   
            }
          }
          break;
      }
      // editor_components defined in extra_controls
      if( !empty($extra_controls[$control_type]) ){
        $extra_control = $extra_controls[$control_type];
        if( !empty($extra_control['components']) ){
          if( !is_array($extra_control['components']) ){
            $extra_components = explode(',', $extra_control['components']);
            $extra_components = array_map('trim', $extra_components);
          }else{
            $extra_components = $extra_control['components'];
          }
          foreach($extra_components as $component ){
            $components[] = $component;
          }
        }
      }
    }

    $components = array_unique($components);
    $defined_components = self::getDefinedComponents();

    // components scripts and css
    foreach( $components as $component ){
      if( !empty($defined_components[$component]) ){
        foreach( $defined_components[$component] as $type => $assets ){
          switch( $type ){
            case 'scripts':
              foreach( $assets as $asset ){
                $scripts[] = $asset;
              }
              break;
            case 'stylesheets':
              foreach( $assets as $asset ){
                $css[] = $asset;
              }
              break;
          }
        }
      }else{
        // not defined, must be a Typesetter component
        $ts_components[] = $component; 
      }
    }

    // editor css
    if( empty($editor['custom_css']) ){
      $css[] = $addonRelativeCode . '/universal_editor/editor.css';
    }else{
      if( is_array($editor['custom_css']) ){
        // array of css files
        foreach( $editor['custom_css'] as $css_file ){
          $css[] = $addonRelativeCode . '/_types/' . $type . '/' . $css_file;
        }
      }else{
        // single css file
        $css[] = $addonRelativeCode . '/_types/' . $type . '/' . $editor['custom_css'];
      }
    }

    // extra controls
    foreach( $editor['controls'] as $control ){
      $control_type = $control['control_type'];
      if( !empty($extra_controls[$control_type]) ){
        $extra_control = $extra_controls[$control_type];
        $controlRelativeCode = $addonRelativeCode . '/universal_editor/controls/' . $control_type . '/';
        //css
        if( !empty($extra_control['stylesheets']) ){
          if( is_array($extra_control['stylesheets']) ){
            // array of css files
            foreach( $extra_control['stylesheets'] as $css_file ){
              $css[] = $controlRelativeCode . $css_file;
            }
          }else{
            // single css file
            $css[] = $controlRelativeCode . $css_file;
          }
        }
        //scripts
        if( !empty($extra_control['scripts']) ){
          if( is_array($extra_control['scripts']) ){
            // array of js files
            foreach( $extra_control['scripts'] as $js_file ){
              $scripts[] = $controlRelativeCode . $js_file;
            }
          }else{
            // single js file
            $scripts[] = $controlRelativeCode . $js_file;
          }
        }
      }
    }


    // editor scripts, must be loaded last
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

    $ts_components = implode(',', $ts_components);
    return array( 'ts_components' => $ts_components, 'scripts' => $scripts, 'css' => $css );
  }




  public static function getExtraControls(){
    global $addonPathData, $addonPathCode;
    if( self::$extra_controls ){
      return self::$extra_controls;
    }
    // in fact we don't need caching here :o), not a user called method, therfore class variable is sufficient
    // $extra_controls_cache = $addonPathData . '/extra_controls.php';
    // if( \gp\tool::LoggedIn() || !file_exists($extra_controls_cache) ){
      $extra_controls = gp\tool\Files::ReadDir($addonPathCode . '/universal_editor/controls/', 1);
      $controls = array();
      foreach( $extra_controls as $extra_control ){
        $control_file = $addonPathCode . '/universal_editor/controls/' . $extra_control . '/control.php';
        if( file_exists($control_file) && strpos($extra_control, '!') !== 0 ){
          include $control_file;
          if( !empty($control) ){
            $controls[$extra_control] = $control;
          }
        }
      }
      // \gp\tool\Files::SaveData($extra_controls_cache, 'controls', $controls);
      self::$extra_controls = $controls;
    // /* DEBUG level 3 */ if( self::$debug_level > 2 ){ self::$debug_counter++; msg('getExtraControls - writing cache file (' . self::$debug_counter . ')'); }
    // }else{
    //  include $extra_controls_cache;
    //  /* DEBUG level 3 */ if( self::$debug_level > 1 ){ self::$debug_counter++; msg('getExtraControls - loading cache file (' . self::$debug_counter  .')'); }
    // }
    return $controls;
  }




  public static function getDefinedComponents(){
    global $addonPathCode, $addonRelativeCode, $dirPrefix;
    if( self::$defined_components ){
      return self::$defined_components;
    }
    $components_file = $addonPathCode . '/universal_editor/components/components.php';
    if( file_exists($components_file) ){
      include($components_file);
      $defined_components = array();
      foreach( $components as $name => $assets ){
        $defined_components[$name] = array();
        foreach( $assets as $asset_type => $asset_ressources ){
          if( !is_array($asset_ressources) ){
            $asset_ressources = explode(',', $asset_ressources);
            $asset_ressources = array_map('trim', $asset_ressources);
          }
          foreach( $asset_ressources as $key => $val ){
            if( is_array($val) ){
              // code statement, no action required
              continue;
            }
            if( strpos($val, '//') !== false ){
              // external source (e.g. CDN) -> keep it as it is
            }elseif( strpos($val, '/') === 0 ){
              // local ressource but not in current directory, check dirPrefix
              if( $dirPrefix != "" && strpos($val, $dirPrefix) !== 0 ){
                $val = $dirPrefix . $val;
              }
            }else{
              // local ressource in current subdirectory, needs prefix
              $val = $addonRelativeCode . '/universal_editor/components/' . $val;
            }
            $asset_ressources[$key] = $val;
          }
          $defined_components[$name][$asset_type] = $asset_ressources;
        }
      }
    }
    /* DEBUG level 3 */ if( self::$debug_level > 2 ){ msg("defined editor components: " . pre($defined_components)); }
    self::$defined_components = $defined_components;
    return $defined_components;
  }


  public static function setLanguage($type, $lang=false) {
    global $page, $dataDir, $addonPathCode, $languages, $config, $ml_object;
    $lang = $lang ? $lang : $config["language"]; // Typesetter UI language

    self::$i18n = array(
      'editor'  => array( 'lang' => array(), 'langmessage' => array() ),
      'section' => array( 'lang' => array(), 'langmessage' => array() ),
    );
    
    if( !empty($ml_object) ){ // only if Multi-Language Manager ist installed
      $ml_list = $ml_object->GetList($page->gp_index);
      $ml_lang = is_array($ml_list) && ($ml_lang = array_search($page->gp_index, $ml_list)) !== false ? $ml_lang : false;
    }else{
      $ml_lang = false;
    }

    $page_lang = $ml_lang ? $ml_lang : $lang;

    if( $ml_lang && $ml_lang != $lang && array_key_exists($ml_lang, $languages) ){
      // page language != admin language AND page language exists in Typesetter's admin languages
      $langmessage_file = $dataDir . "/include/languages/" . $ml_lang . ".main.inc";
      if( file_exists($langmessage_file) ){
        include $langmessage_file;
        self::$i18n['section']['langmessage'] = $langmessage;
        unset($langmessage);
      }
    }else{
      global $langmessage;
      self::$i18n['section']['langmessage'] = $langmessage;
    }

    if( $ml_lang && $ml_lang != $lang ){
      // page language != admin language
      self::$i18n['section']['lang'] = self::getLanguage($type, $ml_lang);
    }else{
      // page language == admin language
      self::$i18n['section']['lang'] = self::getLanguage($type, $lang);
    }
    global $langmessage;
    self::$i18n['editor']['lang'] = self::getLanguage($type, $lang);
    self::$i18n['editor']['langmessage'] = $langmessage;
  }


  public static function getLanguage($type, $lang) {
    global $addonPathCode;
    $section_lang = array();
    $sectiontype_defaultlang_file = $addonPathCode . '/_types/' . $type . '/i18n/en.php';
    $sectiontype_lang_file        = $addonPathCode . '/_types/' . $type . '/i18n/' . $lang . '.php';
    if( file_exists($sectiontype_lang_file) ){
      include $sectiontype_lang_file; // overwrites $section_lang
    }elseif( file_exists($sectiontype_defaultlang_file) ){
      include $sectiontype_defaultlang_file; // overwrites $section_lang
    }
    return $section_lang;
  }

}  
