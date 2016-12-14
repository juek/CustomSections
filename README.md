#Custom Sections plugin for Typesetter CMS#


##About
Developer plugin for rapid prototyping of custom section types. Simple section types can be built even without PHP and JS skills, using the 'universal editor' and {{value}} placeholders. 
Current version 1.0b2 

See also [Typesetter Home](http://www.typesettercms.com), [Typesetter on GitHub](https://github.com/Typesetter/Typesetter)

##Requirements##
* Typesetter CMS 5.0+

##Manual Installation##
Until the plugin is released on typesettercms.com, you need to download and install it manually:

1. Download the [master ZIP Archive](https://github.com/juek/CustomSections/archive/master.zip)

2. Upload the extracted folder 'CustomSections-master' to your server into the /addons directory

3. Install using Typesetter's Admin Toolbox -> Plugins -> Manage -> Available -> Custom Sections

## Screenshot
Demo section type "Shop Item" using the universal editor component.

![Screenshot](/screenshot-01.png?raw=true)

## A note for developers
Building own section types normally requires in-depht knowledge of Typesetter CMS. This plugin will make things way easier, but it still hooks into the CMS at a rather low level. This implicates that Typesetter will not be able to catch and report all errors like it can do on higher levels. Especially errors in the editor components, which get loaded via AJAX, can be really tricky to debug. When you start creating your own section types using this plugin, frequent testing is a good idea. 

## Credits
[a2exfr](http://my-sitelab.com/), [juergen](https://www.typesettercms.com/User/789)

## License
GPL License, same as Typesetter CMS. For bundled thirdparty components see the respective subdirectories.
