
/*var HangarXPLOR = HangarXPLOR || {};

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
}*/

var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseUpgrade = function()
{
  this.filters.is_upgrade = $('.js-upgrade-data', this).length > 0;
  
  if (this.filters.is_upgrade)
  {
    this.upgrade_data = JSON.parse($('.js-upgrade-data', this).val());

    $('.title:contains(Upgrade)', this).after('<div class="kind">Upgrade</div>');

    HangarXPLOR._upgradeCount += 1;

    this.displayName = this.upgrade_data.match_items[0].name + ' to ' + this.upgrade_data.target_items[0].name

    var target_name = this.upgrade_data.target_items[0].name;
    var i, j;
    for (i = 0, j = HangarXPLOR._shipMatrix.length; i < j; i++) {
      if (target_name.toLowerCase().indexOf(HangarXPLOR._shipMatrix[i].name.toLowerCase()) > -1) {

        HangarXPLOR.Log('Matched', HangarXPLOR._shipMatrix[i].name, 'in', target_name);

        target_name = (HangarXPLOR._shipMatrix[i].displayName || HangarXPLOR._shipMatrix[i].name);
        if (HangarXPLOR._shipMatrix[i].thumbnail != undefined) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + HangarXPLOR._shipMatrix[i].thumbnail + '")'});
        }
        break;
      }
    }
  }
}
