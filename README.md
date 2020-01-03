# Custom Sections plugin for Typesetter CMS #


## About ##
Developer plugin for easy prototyping and creation of custom section types. Simple section types can be built even without PHP and JS skills, using the 'universal editor' and {{value}} placeholders. 
Current version 1.0b2 

See also [Typesetter Home](https://www.typesettercms.com), [Typesetter on GitHub](https://github.com/Typesetter/Typesetter)

## Requirements ##
* Typesetter CMS 5.0+

## Manual Installation ##
Until the plugin is released on typesettercms.com, you need to download and install it manually:

1. Download the [master ZIP Archive](https://github.com/juek/CustomSections/archive/master.zip)

2. Upload the extracted folder 'CustomSections-master' to your server into the /addons directory

3. Install using Typesetter's Admin Toolbox -> Plugins -> Manage -> Available -> Custom Sections

## Screenshot
Demo section type "Shop Item" using the universal editor component.

![Screenshot](/screenshot-01.png?raw=true)

## Currently available control types
These control types are ready to be used in 'universal editor'

| control_type | control_type | control_type |
| :---: | :---: | :---: |
| **`checkbox`**<br/><br/> ![Screenshot](/docs/controls/checkbox.png?raw=true) | **`ck_editor`**<br/><br/> ![Screenshot](/docs/controls/ck_editor.png?raw=true)<br/>pops up a CK Editor in a modal box | **`finder_select`**<br/><br/>![Screenshot](/docs/controls/image.png?raw=true)<br/>opens a file manager |
| **`text`**<br/><br/>![Screenshot](/docs/controls/text.png?raw=true) | **`select`**<br/><br/>![Screenshot](/docs/controls/select.png?raw=true) | **`link_field`**<br/><br/>![Screenshot](/docs/controls/link_field.png?raw=true)<br/>with autocomplete for <br>internal pages and button that<br/> opens a file manager |
| **`clockpicker`**<br/><br/> ![Screenshot](/docs/controls/clockpicker.png?raw=true) | **`colorpicker`**<br/><br/>![Screenshot](/docs/controls/colorpicker.png?raw=true) | **`datepicker`**<br/><br/>![Screenshot](/docs/controls/datepicker.png?raw=true) |
| **`multi_image`**<br/><br/>![Screenshot](/docs/controls/multi_image.png?raw=true)<br/>opens a file manager window | **`radio_group`**<br/><br/>![Screenshot](/docs/controls/radio_group.png?raw=true) |  |
| **`iconpicker`**(extra control)<br/><br/>![Screenshot](/docs/controls/iconpicker.png?raw=true) | **`knob`**(extra control)<br/><br/>![Screenshot](/docs/controls/knob.png?raw=true) | **`multi_date`**(extra control)<br/><br/>![Screenshot](/docs/controls/multi_date.png?raw=true)<br/>with sorting option, <br>dates are managed in modal boxes |

## A note for users/admins
Custom Sections is a developer/designer plugin. To make use of it, you will need to have at least basic coding skills, namely HTML and CSS, and have some experience in Typesetter’s section management. You won't necessarily have to know much about PHP or JavaScript but you must not produce syntax errors (such as missing quotes, brackets, etc.) when building upon the demo types. Required coding skills grow with the complexity of things you're planning to do. The bundled section types, whichever they might eventually be, are merely meant as examples and they certainly won't be of any practical use unless you figure out how to adapt them. We will subsequently try to make the plugin as fail-safe as possible and to provide decent documentation. For the time being (beta stage) some parts will be hard to understand and are subject to change. 
So, to come to the point, if you're not into coding at all, this one is not for you.

## A note for developers
Building own section types normally requires in-depht knowledge of Typesetter CMS. This plugin will make things way easier, but it still hooks into the CMS at a rather low level. This implicates that Typesetter will not be able to catch and report all errors like it can do on higher levels. Especially errors in the editor components, which are 'AJAXed' in a combined form togehter with other script components required for editing, can be quite tricky to debug. When you start creating your own section types using this plugin, frequent testing is a good idea. 

## Credits
a2exfr, [juergen](https://www.typesettercms.com/User/789)

## License
GPL License, same as Typesetter CMS. For bundled thirdparty components see the respective subdirectories.
