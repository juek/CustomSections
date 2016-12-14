<?php 

defined('is_running') or die('Not an entry point...');

$editor = array(
  'custom_scripts' => false,    // false = we use universal editor
  'custom_css' =>     false,    // false = we use universal editor

  'controls' => array( 

    // value 'angle' --start
    'angle' => array(
      'label' => '<i class="fa fa-rotate-right"></i> Compass Needle Angle',
      'control_type' => 'knob', // extra control 'knob', see /universal_editor/controls/knob/
      'attributes' => array(
        /* accepted data attributes, see http://anthonyterrien.com/knob/ */
        'data-min' => '0',
        'data-max' => '360',
        'data-step' => '1',
        'data-width' => '76', // default=1000(px)|%|em
        'data-height' => '76', // default=100(px)|%|em
        'data-cursor' => '0.1', // false|true|gauge|numeric value
        //'data-thickness' => '0.3', // gauge thickness 0-1
        'data-lineCap' => 'round', // butt|round
        //'data-displayInput' => 'true',
        //'data-font' => 'sans-serif',
        //'data-fontWeight' => 'bold',
        'data-inputColor' => '#87CEEB',
        'data-fgColor' => '#87CEEB',
        'data-bgColor' => '#EEEEEE',
        'data-displayPrevious' => 'true',
        //'data-angleOffset' => '90',
        //'data-angleArc' => '250',
        //'data-rotation' => 'clockwise', // clockwise|anticlockwise
        //'data-stopper' => 'true',
        //'data-readOnly' => 'false',
      ),
    ), 
    // value 'angle' --end

  ),
);
