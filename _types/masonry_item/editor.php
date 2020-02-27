<?php

/**
 * Editor definition for Custom Section type 'Masonry Item'
 * for Typesetter CMS developer plugin 'Custom Sections'
 *
 */

defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts' =>     false,  // use a custom editor Javascript for this section type?
  'custom_css' =>         false,  // use a custom editor CSS for this section type?
  'editor_components' =>  false,  // only when using custom editor script(s), we use this to load components like ck_editor, colorpicker, clockpicker, datepicker
                                  // the components value can be a string 'ck_editor', a csv 'ck_editor,colorpicker' or an array('ck_editor','colorpicker');
                                  // when the universal editor is used, we do not need to set this value, because components will be auto loaded with the respective control_type
  //* disabled */ 'js_on_content' => '',

  'controls' => array(

    // value 'image' --start
    'image' => array(
      'label' => '<i class="fa fa-image"></i> Bild auswählen',
      'control_type' => 'finder_select',
      'attributes' => array(
        // 'class' => '',

        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        //'focus' => 'function(){ $(this).select(); }',
      ),
    ),
    // value 'image' --end


    // value 'title' --start
    'title' => array(
      'label' => '<i class="fa fa-font"></i> Werktitel',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Also, der Titel…',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ),
    // value 'title' --end


    // value 'text' --start
    'text' => array(
      'label' => '<i class="fa fa-font"></i> Beschreibung',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => 'Naja, was man halt sieht…',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ),
    // value 'text' --end


    // value 'price' --start
    'price' => array(
      'label' => '<i class="fa fa-money"></i> Preis',
      'control_type' => 'text',
      'attributes' => array(
        // 'class' => '',
        'placeholder' => '…und was es kosten könnte',
        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
        'focus' => 'function(){ $(this).select(); }',
      ),
    ),
    // value 'price' --end


    // value 'vignette' --start
    'vignette' => array(
      'label' => '<i class="fa fa-adjust"></i> Vignette',
      'control_type' => 'checkbox',
      'attributes' => array(
        // 'class' => '',

        // 'pattern' => '', // regex for validation
      ),
      'on' => array(
       // 'focus' => 'function(){ $(this).select(); }',
      ),
    ),
    // value 'vignette' --end


    // value 'ratio_classes' --start
    'ratio_classes' => array(
      'label' => '<i class="fa fa-th-large"></i> Vorschau Proportion',
      'control_type' => 'radio_group', // also possible controls: select, text
      'radio-buttons' => array(
        // radio value      => radio label
        'aspect-native'     => 'Original belassen',
        'aspect-landscape'  => 'Querformat erzwingen',
        'aspect-portrait'   => 'Hochformat erzwingen',
      ),
      'attributes' => array(
        // 'data-applyto' => 'class', // this attribute tells the editor that the value shall be applied to the section's class attribute
      ),
      'on' => array(),
    ),
    // value 'ratio_classes' --end

  ),
);
