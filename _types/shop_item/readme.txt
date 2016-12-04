############## Custom Section demo type "Shop Item" #################

This is meant as a demo type for the Custom Sections plugin. 
We recommend to keep it untouched for reference. 

If you want to use this item in a modified form, make a copy 
of this folder (e.g. 'my_shop_item') and change the entry in 
CustomSections.php in the NewSections method to 

$section_types['my_shop_item'] = array( 'label' => 'My Shop Item' );

You can disable this section type 
by renaming it's folder to start with a !(exclamation mark)

CustomSections/_types/shop_item == enabled
CustomSections/_types/!shop_item == disabled

#####################################################################
