
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

    // Show target ship thumbnail for upgrades
    var $upgradeData = $('.js-upgrade-data', this);
    if ($upgradeData.length > 0) {
      try {
        this.upgrade_data = JSON.parse($upgradeData.val());
        var target_name = this.upgrade_data.target_items[0].name.trim();
        var i, j;
        for (i = 0, j = HangarXPLOR._shipMatrix.length; i < j; i++) {
          if (target_name.toLowerCase().indexOf(HangarXPLOR._shipMatrix[i].name.toLowerCase()) > -1) {
            if (HangarXPLOR._shipMatrix[i].thumbnail != undefined) {
              $('.basic-infos .image', this).css({ 'background-image': 'url("' + HangarXPLOR._shipMatrix[i].thumbnail + '")'});
            }
            break;
          }
        }
      } catch (e) { }
    }
  }
}
