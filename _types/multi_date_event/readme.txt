############## Custom Section demo type "Single Event" #################

This is meant as a demo type for the Custom Sections plugin. 
We recommend to keep it untouched for reference. 

If you want to use this item in a modified form, make a copy 
of this folder (e.g. 'my_event') and change the entry in 
CustomSections.php in the NewSections method to 

$section_types['my_event'] = array( 'label' => 'My Event' );

You can disable this section type by adding 
a renaming it's folder name to start with a !(exclamation mark)

CustomSections/_types/single_event == enabled
CustomSections/_types/!single_event == disabled

#####################################################################