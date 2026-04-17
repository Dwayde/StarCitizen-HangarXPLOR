
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseEquipment = function(parsedText)
{
  var $equipment = $('.kind:contains(FPS Equipment)', this).parent().parent();

  this.filters.is_equipment  = $equipment.length == 1;
  this.filters.has_equipment = $equipment.length >= 1;


  parsedText = parsedText.toLowerCase();

  // New type of titles

  if(parsedText.search(/\armor set\b/) >= 0 || parsedText.search(/\gear pack\b/) >= 0 ) {
    this.filters.is_equipment  = true;
    this.filters.has_equipment = true;
  }

}
