
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._shipCount     = HangarXPLOR._shipCount || 0;
HangarXPLOR._upgradeCount  = HangarXPLOR._upgradeCount || 0;
HangarXPLOR._giftableCount = HangarXPLOR._giftableCount || 0;
HangarXPLOR._packageCount  = HangarXPLOR._packageCount || 0;
HangarXPLOR._ltiCount      = HangarXPLOR._ltiCount || 0;
HangarXPLOR._warbondCount  = HangarXPLOR._warbondCount || 0;
HangarXPLOR._raw           = HangarXPLOR._raw || [];

// Apply a pre-defined filter to a list of items
HangarXPLOR.ParsePledge = function()
{
  // Pre-cache raw markup
  if (HangarXPLOR._fromCache != true) HangarXPLOR._raw.push(this.outerHTML);

  var pledgeName  = $('.js-pledge-name', this).val() || '';
  var $wrapper    = $('.wrapper-col', this);
  
  var h3Text     = $('.title-col h3', this)[0];

  var attributedText = $('.row .basic-infos .wrapper-col .title-col .availability', this)[0];

  if (pledgeName.length > 0) {

    pledgeName = pledgeName.replace(/ {2}/gi, " ")
                           .replace(/^add-ons - /i, '')
                           .replace(/^standalone ship - /i, '')
                           .replace(/^combo - /i, '')
                           .replace(/^package - /i, '')
                           .replace(/^ship upgrades - /i, '')
                           .replace(/^extras - /i, '')
                           .replace(/^paints - /i, '')
                           .trim();

    this.filters                 = {};

    this.pledge_type             = 'pledge';
    this.pledge_name             = pledgeName;
    this.pledge_id               = parseInt($('.js-pledge-id', this).val().trim());
    this.pledge_cost             = $('.js-pledge-value', this).val();
    this.displayName             = pledgeName;


    pledgeName = pledgeName.toLowerCase();

    HangarXPLOR.PreProcess.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseShip.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseComponent.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseEquipment.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseSkin.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseDecoration.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseUpgrade.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseReward.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseCoupon.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseHangar.apply(this, [ pledgeName ]);

    this.melt_value              = parseFloat(this.pledge_cost.replace("$", "").replace(",", "").replace(" USD", ""));
    if (this.melt_value != this.melt_value) this.melt_value = 0; // NaN safety

    this.filters.has_squadron    = $('.title:contains(Squadron 42 Digital Download)', this).length > 0;
    this.filters.has_starcitizen = $('.title:contains(Star Citizen Digital Download)', this).length > 0;
    this.filters.is_warbond      = this.pledge_name.toLowerCase().indexOf(' warbond') > -1 || this.pledge_name.toLowerCase().indexOf(' wb') > -1 || this.pledge_name.toLowerCase().indexOf(' war bond') > -1;
    this.filters.is_meltable     = $('.js-reclaim', this).length > 0;
    this.filters.is_giftable     = $('.label:contains(Gift)', this).length > 0 && this.melt_value <= 1000;
    this.filters.is_package      = this.filters.has_squadron || this.filters.has_starcitizen;
    this.filters.has_value       = this.melt_value > 0;
    if(this.filters.has_component || this.filters.has_equipment) {
      this.filters.is_component = 1; 
    } else {
      this.filters.is_component = 0; 
    }

    // TODO: Support for js-pledge-configuration-value
    
    this.filters.is_selected     = false;

    if (this.filters.is_ship)             this.pledge_type = 'ship';
    else if (this.filters.has_ship)       this.pledge_type = 'combo';
    else if (this.filters.has_component)  this.pledge_type = 'component';
    else if (this.filters.has_equipment)  this.pledge_type = 'equipment';
    else if (this.filters.has_skin)       this.pledge_type = 'paint';
    else if (this.filters.has_decoration) this.pledge_type = 'decoration';
    else if (this.filters.is_upgrade)     this.pledge_type = 'upgrade';
    else if (this.filters.is_coupon)      this.pledge_type = 'coupon';

    if (!this.filters.has_ship &&
        (this.filters.has_skin ? 1 : 0) +
        (this.filters.has_equipment ? 1 : 0) +
        (this.filters.has_component ? 1 : 0) +
        (this.filters.has_decoration ? 1 : 0) > 1) this.pledge_type = 'loot';

    if(pledgeName.includes('coin')) {
      this.pledge_type = 'loot';
    }
    
    if (this.filters.is_package)  HangarXPLOR._packageCount += 1;
    if (this.filters.is_giftable) HangarXPLOR._giftableCount += 1;
    
    this.displayName = this.displayName.replace(" Upgrade", "");

    // TODO: Support for HangarXPLOR._setting.NoPledgeID
    this.displayName = this.pledge_type + ' - ' + this.displayName + ' (' + this.pledge_id + ')';

    // HotFix for some ships appears as upgrade type
    if(this.filters.is_ship) {
      this.filters.is_upgrade = false;
    }

    if (this.filters.is_giftable) {
      //Add giftable to name
      //this.displayName += " [GIFTABLE]";
      if(attributedText.textContent == "Attributed") {
        //Add giftable to attributed
        //attributedText.textContent = attributedText.textContent  + " [GIFTABLE]";
      }

      //Add gitable image to package in top right corner
      var wrapper_new = $('.row .basic-infos .wrapper-col', this);
      wrapper_new.append($("<span>", { class: 'effect trans-opacity trans-03s giftable' }));
    }
    
    $wrapper.append($("<div>", { class: 'date-col melt-col' }).append($('<label>', { text: 'Melt Value:  ' }), this.pledge_cost));
    $wrapper.append($("<div>", { class: 'items-col pledge-col' }).append($('<label>', { text: 'Base Pledge:  ' }), this.pledge_name));

    this.sortName = this.displayName;
    h3Text.textContent = this.displayName;
    
    
  } else {
    HangarXPLOR.Log('Warning: Error parsing title', this.innerHTML);
  }

  // New Logic to parse content by contains

  var pledgeContains = $('.row .basic-infos .wrapper-col .items-col', this)[0].textContent || '';

  if (pledgeContains.length > 0) {
    
    pledgeContains = pledgeContains.replace("Contains:", "")
                                   .trim();

    pledgeContains = pledgeContains.toLowerCase();

    HangarXPLOR.PreProcess.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseShip.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseComponent.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseEquipment.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseSkin.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseDecoration.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseUpgrade.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseReward.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseCoupon.apply(this, [ pledgeContains ]);
    HangarXPLOR.ParseHangar.apply(this, [ pledgeContains ]);

    var oldType = this.pledge_type;

    if (this.filters.is_ship)             this.pledge_type = 'ship';
    else if (this.filters.has_ship)       this.pledge_type = 'combo';
    else if (this.filters.has_component)  this.pledge_type = 'component';
    else if (this.filters.has_equipment)  this.pledge_type = 'equipment';
    else if (this.filters.has_skin)       this.pledge_type = 'paint';
    else if (this.filters.has_decoration) this.pledge_type = 'decoration';
    else if (this.filters.is_upgrade)     this.pledge_type = 'upgrade';
    else if (this.filters.is_coupon)      this.pledge_type = 'coupon';

    if (!this.filters.has_ship &&
      (this.filters.has_skin ? 1 : 0) +
      (this.filters.has_equipment ? 1 : 0) +
      (this.filters.has_component ? 1 : 0) +
      (this.filters.has_decoration ? 1 : 0) > 1) this.pledge_type = 'loot';

    if(pledgeContains.includes('coin')) {
      this.pledge_type = 'loot';
    }


    if(oldType != this.pledge_type) {

      // Replace old type in title
      this.displayName = this.displayName.replace("pledge - ", "")
                                         .replace("loot - ", "")
                                         .replace("ship - ", "")
                                         .replace("component - ", "")
                                         .replace("equipment - ", "")
                                         .replace("decoration - ", "")
                                         .replace("upgrade - ", "")
                                         .replace("coupon - ", "")
                                         .replace("skin - ", "")
                                         .replace("paint - ", "")
                                         .replace(" Upgrade", "");

      // Update title
      this.displayName = this.pledge_type + ' - ' + this.displayName + ' (' + this.pledge_id + ')';

      this.sortName = this.displayName;
      h3Text.textContent = this.displayName;

    }



    

  } else {
        HangarXPLOR.Log('Warning: Error parsing contains', this.innerHTML);
  }


  HangarXPLOR._inventory.push(this);
}
