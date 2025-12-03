
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseUpgrade = function(pledgeName)
{
  var checkName = pledgeName.toLowerCase();

  // Added new upgrade titles types, disabled case check

  this.filters.is_upgrade = ( checkName.indexOf('upgrade') == 0 ||
                              checkName.indexOf('upgrade') == checkName.length - 7 || checkName.search(/\upgrade\b/) >= 0 );
  
  if (this.filters.is_upgrade)
  {
    $('.title:contains(Upgrade)', this).after('<div class="kind">Upgrade</div>');

    HangarXPLOR._upgradeCount += 1;

    // Added new upgrade titles types
    this.displayName = this.displayName.replace(/^upgrade (- )?/i, '')
                                       .replace(/^ (- )?upgrade$/i, '')
                                       .replace(/^ (- )?Upgrade$/i, '')
                                       .replace(/^Upgrade (- )?/i, '');
  }
}
