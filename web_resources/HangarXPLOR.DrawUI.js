
var HangarXPLOR = HangarXPLOR || {};

const delay = ms => new Promise(res => setTimeout(res, ms));

// Render UI controls
HangarXPLOR.DrawUI = function()
{
  var $controls = $($('.controls')[0]);
  $controls.addClass('js-custom-controls');
  $controls.removeClass('controls');
  $controls.empty();
  
  var $controls1 = $('<div>', { class: 'controls clearfix mrn15' });
  var $controls2 = $('<div>', { class: 'controls clearfix mrn15' });
  var $controls3 = $('<div>', { class: 'controls clearfix mrn15 js-custom-search-wrapper' });

  $controls.append($controls1, $controls2, $controls3);
  
  $('.js-pager').remove();
  
  $controls1.append(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Types', Class: 'first', Selected: HangarXPLOR._type == 'All' },
    { Value: 'HasShip', Text: 'All Ships', Selected: HangarXPLOR._type == 'HasShip' },
    { Value: 'IsShip', Text: 'Standalone Ships', Selected: HangarXPLOR._type == 'IsShip' },
    { Value: 'IsPackage', Text: 'Game Packages', Selected: HangarXPLOR._type == 'IsPackage' },
    { Value: 'IsCombo', Text: 'Combo Packs', Selected: HangarXPLOR._type == 'IsCombo' },
    { Value: 'IsNameable', Text: 'Nameable', Selected: HangarXPLOR._type == 'IsNameable' },
    // { Value: 'IsExtra', Text: 'All Extras', Class: 'split', Selected: HangarXPLOR._type == 'IsExtra' },
    // { Value: 'IsAddOn', Text: 'Add Ons', Selected: HangarXPLOR._type == 'IsAddOn' },
    { Value: 'IsSkin', Text: 'Paints', Class: 'split', Selected: HangarXPLOR._type == 'IsSkin' },
    { Value: 'IsComponent', Text: 'Components', Selected: HangarXPLOR._type == 'IsComponent' },
    { Value: 'IsEquipment', Text: 'Equipment', Selected: HangarXPLOR._type == 'IsEquipment' },
    { Value: 'IsUpgrade', Text: 'Upgrades', Selected: HangarXPLOR._type == 'IsUpgrade' },
    // { Value: 'IsFlair', Text: 'All Flair', Class: 'split', Selected: HangarXPLOR._type == 'IsFlair' },
    { Value: 'IsDecoration', Text: 'Decorations', Class: 'split', Selected: HangarXPLOR._type == 'IsDecoration' },
    // { Value: 'IsModel', Text: 'Models', Selected: HangarXPLOR._type == 'IsModel' },
    // { Value: 'IsPlant', Text: 'Plants', Selected: HangarXPLOR._type == 'IsPlant' },
    // { Value: 'IsPoster', Text: 'Posters', Selected: HangarXPLOR._type == 'IsPoster' },
    { Value: 'IsSelected', Text: 'Selected', Class: 'split', Selected: HangarXPLOR._type == 'IsSelected' },
  ], '158px', 'js-custom-filter', function(e, value) { HangarXPLOR._type = value; HangarXPLOR.SaveSettings(); HangarXPLOR.Render(); HangarXPLOR.RefreshPager(); /* HangarXPLOR.ResetBulkUI(); */ }));
  
  $controls1.append(HangarXPLOR.Dropdown([
    { Value: 'Purchased', Text: 'Pledge Date', Selected: HangarXPLOR._sort == 'Purchased' },
    { Value: 'Name', Text: 'Pledge Name', Selected: HangarXPLOR._sort == 'Name' },
    { Value: 'Value', Text: 'Pledge Value', Selected: HangarXPLOR._sort == 'Value' },
  ], '137px', 'js-custom-sort', function(e, value) { HangarXPLOR._sort = value; HangarXPLOR.SaveSettings(); HangarXPLOR.Render(); HangarXPLOR.RefreshPager(); }));
  
  $controls1.append(HangarXPLOR.Pager([
    { Value: '9999', Text: 'Display All', Class: 'first', Selected: HangarXPLOR._pageCount == 9999 },
    { Value: '10', Text: '10 per page', Selected: HangarXPLOR._pageCount == 10 },
    { Value: '20', Text: '20 per page', Selected: HangarXPLOR._pageCount == 20 },
    { Value: '50', Text: '50 per page', Selected: HangarXPLOR._pageCount == 50 },
    { Value: '100', Text: '100 per page', Selected: HangarXPLOR._pageCount == 100 },
  ], '140px', 'js-custom-pager', HangarXPLOR.Render ));

  var $bottomControls = $('<div>', { class: 'controls clearfix mrn15' });

  $bottomControls.append(HangarXPLOR.Pager([
    { Value: '9999', Text: 'Display All', Class: 'first', Selected: HangarXPLOR._pageCount == 9999 },
    { Value: '10', Text: '10 per page', Selected: HangarXPLOR._pageCount == 10 },
    { Value: '20', Text: '20 per page', Selected: HangarXPLOR._pageCount == 20 },
    { Value: '50', Text: '50 per page', Selected: HangarXPLOR._pageCount == 50 },
    { Value: '100', Text: '100 per page', Selected: HangarXPLOR._pageCount == 100 },
  ], '140px', 'js-custom-pager', HangarXPLOR.Render ));

  $('.list-items').after($bottomControls);
  
  var toggleHandler = function(e, label, value)
  {
    HangarXPLOR._feature[label] = value;
    
    HangarXPLOR.SaveSettings();
    HangarXPLOR.Render();
    HangarXPLOR.RefreshPager();
    // HangarXPLOR.ResetBulkUI(); 
  };
  
  $controls2.append(HangarXPLOR.Toggle('LTI',      'HasLTI',     '!HasLTI',     'js-custom-filter', toggleHandler, HangarXPLOR._feature.LTI));
  $controls2.append(HangarXPLOR.Toggle('Warbond',  'IsWarbond',  '!IsWarbond',  'js-custom-filter', toggleHandler, HangarXPLOR._feature.Warbond));
  $controls2.append(HangarXPLOR.Toggle('Giftable', 'IsGiftable', '!IsGiftable', 'js-custom-filter', toggleHandler, HangarXPLOR._feature.Giftable));
  $controls2.append(HangarXPLOR.Toggle('Meltable', 'IsMeltable', '!IsMeltable', 'js-custom-filter', toggleHandler, HangarXPLOR._feature.Meltable));
  $controls2.append(HangarXPLOR.Toggle('Upgraded', 'IsUpgraded', '!IsUpgraded', 'js-custom-filter', toggleHandler, HangarXPLOR._feature.Upgraded));
  $controls2.append(HangarXPLOR.Toggle('Valuable', 'HasValue',   '!HasValue',   'js-custom-filter', toggleHandler, HangarXPLOR._feature.Valuable));
  $controls2.append(HangarXPLOR.Toggle('Reward',   'IsReward',   '!IsReward',   'js-custom-filter', toggleHandler, HangarXPLOR._feature.Reward));
  $controls2.append(HangarXPLOR.Toggle('Selected', 'IsSelected', '',  'js-custom-filter', toggleHandler, ''));
  $controls2.append(HangarXPLOR.Toggle('Free CCUs','IsFreeCCU',  '!IsFreeCCU',  'js-custom-filter', toggleHandler, '!IsFreeCCU'));

  $controls3.append(HangarXPLOR.SearchBox());

  // Upgrade chain
  $('.sidenav').append(HangarXPLOR.Button('Apply upgrades', 'upgradechainbutton js-upgrade-chain', HangarXPLOR._callbacks.UpgradeChain));

  // Export json, csv of all pledges
  $('.sidenav').append(HangarXPLOR.Button('Pledges JSON', 'exportbuttonjson js-export-hangar', HangarXPLOR._callbacks.ExportHangarJSON));
  $('.sidenav').append(HangarXPLOR.Button('Pledges CSV', 'exportbuttoncsv js-export-hangar', HangarXPLOR._callbacks.ExportHangarCSV));


  // Clear cache button

  /*var toprow = $('.top');
  toprow.append(
    $('<span>', { class: 'shadow-button trans-02s trans-color clearcaches js-clear-cache'}).append(
      $('<span>', { class: 'icon trans-02s' }),
      $('<span>', { class: 'label js-label trans-02s', id: 'clearCache', value: 'clearCache'}).text("Reload hangar"),
      $('<span>', { class: 'left-section'}),
      $('<span>', { class: 'right-section'})
    )
  );*/

  $('<span>', { class: 'clearcachebutton shadow-button trans-02s trans-color clearcaches js-clear-cache', id: 'clearCache'}).append(
    $('<span>', { class: 'icon trans-02s' }),
    $('<span>', { class: 'label js-label trans-02s'}).text("Reload hangar"),
    $('<span>', { class: 'left-section'}),
    $('<span>', { class: 'right-section'})
  ).insertAfter('.title').parent('.top');
  
  document.getElementById('clearCache').addEventListener("click", function() {
    if(confirm('Do you want to reload hangar?') == true) {
      chrome.storage.sync.get(null, function(settings) {
          settings._cacheSalt  = btoa(Math.random());

          chrome.storage.sync.set(settings, () => {
            //chrome.tabs.reload(details.tabId);
            window.close();
          });
      });
      window.location.reload();
      }
  });

  $('body').append($('<div>', { class: 'upgradechainblock s-overlay overlay modals apply-upgrade lightbox js-lightbox', id: 'upgradechainblock' } ) );

  var upgradechainhtml = ``;
  upgradechainhtml += 
  `
  <input type="hidden" id="upgradechain_refresh" value=0 />
  <input type="hidden" id="upgradechain_selected_pledge_name" value="" />
  <div class="shader js-shader" style="opacity: 1;"></div>
  <div class="content js-content" style="display: block; margin-left: 8px; margin-top: 10px; opacity: 1;">
  <div class="modal-wrapper " style="width: 624px;">
  <div class="top-border">
        <img src="https://cdn.robertsspaceindustries.com/static/images/modal_blue_line.png">
        <div class="h-border"></div>
    <div class="l-corner"></div>
    <div class="r-corner"></div>
  </div>
  <div class="modal-inner">
    <span onClick="closeupgradechain();" class="close trans-03s .trans-opacity"></span>
    <div id="upgrade" class="inner-content" style="">
  <h2><span class="icon"></span>APPLY CHAIN OF UPGRADEs</h2>
  <div class="padder">
    <div class="separator"></div>
    <div class="clearfix">
      <form id="upgradechaain-pledge" action="" method="POST" class="legacy-form">
        <div class="upgradechain-errors error-message js-error-message"></div>
        <div class="upgradechain-msg success-message js-success-message"></div>
        <p class="head">You are about to create upgrade for your pledge. This will <span class="important">delete the upgrade from your account</span> and apply the upgrade to the selected pledge by replacing ship.</p>
        
        <p class="head">You can <span class="important">apply upgrades one after another to same pledge</span> or/and complete multiple upgrade chains one after another <span class="important">without requirment to reload page</span> each time.</p>
       
        <p class="warning">WARNING! This action is PERMANENT and cannot be undone.</p>
        <div class="pane-selection">
          <span>Selected pledge:</span>
          <p id="upgradechain-selected-pledge" class="selected-pledge js-selected-pledge"></p>
          <ul class="remove">
          <p class="heading">Replace</p>
                      <li><del id="upgradechain_ship_delete"></del></li>
                    </ul>
                    <ul class="add">
          <p class="heading">With</p>
                      <li><ins id="upgradechain_ship_result"></ins></li>
                    </ul>
        <div class="clear"></div>
      </div>
    <div class="panes" style="left: 0px;">
        <div style="padding-top: 0px;" id="upgradechain-step1" class="pane step1">
        <p>Please <span class="important">select</span> the pledge on which you want to apply the upgrades to:</p>
        <div class="js-custom-controls upgradechain-custom-controls">
          <input onchange="upgradechain_search_ship_func();" id="upgradechain_search_ship" class="js-custom-search upgradechain-custom-search" placeholder="Search ships"/>
        </div>
        <div class="scrollable fancy" style="height: 177px;">
          <div class="scrollbar" style="height: 177px;">
            <div class="track" style="height: 177px;">
              <div class="thumb" style="top: 0px; height: 177px;">
                <div class="end"></div>
              </div>
            </div>
          </div>
          <div class="viewport" style="overflow-y: visible; height: 177px;">
            <div class="content" style="top: 0px;">
              <div class="upgrade-pledge-rows">`;

  
  var items_buffer = HangarXPLOR._inventory;

  for (var i = 0, j = HangarXPLOR._inventory.length; i < j; i++) { 
    if(HangarXPLOR._inventory[i].filters.is_ship) {
      var id = HangarXPLOR._inventory[i].pledge_id;
      var name = HangarXPLOR._inventory[i].displayName;
      name = replaceStrangeTxts(name);
      let name_ar = name.split('[');
      if(name_ar.length > 1) {
        name = name_ar[0].trim();
      }
      var fullname = HangarXPLOR._inventory[i].pledge_name;
      upgradechainhtml += `
      <div id="upgrade-row-` + id + `" class="upgradechain-pledge-row row">
        <label onClick="upgradechain_selectpledge(` + id + `);" for="upgrade-radio-` + id + `">
          <input id="upgradechain_ship_` + id + `" type=hidden value="` + name + `"/>
          <input id="upgrade-radio-`+ id + `" name="pledge_id" type="radio" value="` + id + `">
          <span id="upgradechain_ship_span_` + id + `">` + fullname;
        if(!fullname.includes(name)) {
          upgradechainhtml += " Ship: " + name;
        }
        upgradechainhtml += " (#" + id + ")" + `</span>
        </label>
      </div>`;
    }
  }


  upgradechainhtml += `   
              </div>
            </div>
          </div>
        </div>

        <span class="submit-wrapper js-next left disabled">
          <span class="submit-hover trans-02s trans-opacity"></span>
          <input style="display: none;" id="upgradechainnext" onClick="upgradechainnextbut();" type="button" value="NEXT" class="trans-02s trans-color trans-background">
        </span>
      </div>

      <div style="padding-top: 0px;display: none;" id="upgradechain-step2" class="pane step2">

        <p>Please <span class="important">select</span> the upgrade which you want to apply on selected pledge:</p>
        <div class="js-custom-controls upgradechain-custom-controls">
          <input onchange="upgradechain_search_ccu_func();" id="upgradechain_search_ccu" class="js-custom-search upgradechain-custom-search" placeholder="Search upgrades"/>
        </div>
        <div class="scrollable fancy" style="height: 177px;">
          <div class="scrollbar" style="height: 177px;">
            <div class="track" style="height: 177px;">
              <div class="thumb" style="top: 0px; height: 177px;">
                <div class="end"></div>
              </div>
            </div>
          </div>
          <div class="viewport" style="overflow-y: visible; height: 177px;">
            <div class="content" style="top: 0px;">
              <div class="upgrade-ccu-rows">`;

  for (var i = 0, j = HangarXPLOR._inventory.length; i < j; i++) {

    if(HangarXPLOR._inventory[i].filters.is_upgrade) {

      var id = HangarXPLOR._inventory[i].pledge_id;
      var name = HangarXPLOR._inventory[i].displayName;
      var fullname = HangarXPLOR._inventory[i].pledge_name;

      name = replaceStrangeTxts(name);

      let t_ar = name.split("to");
      var ship_from = t_ar[0].trim();
      var ship_to = t_ar[1].trim();

      upgradechainhtml += `
      <div id="upgrade-ccurow-` + id + `" class="upgradechain-ccu-row row">
        <label onClick="upgradechain_selectccu(` + id + `);" for="upgradeccu-radio-` + id + `">
          <input id="upgradechain_ship_from_` + id + `" type=hidden value="` + ship_from + `"/>
          <input id="upgradechain_ship_to_` + id + `" type=hidden value="` + ship_to + `"/>
          <input id="upgradeccu-radio-`+ id + `" name="ccu_id" type="radio" value="` + id + `">
          <span id="upgradechain_ccu_span_` + id + `">` + fullname + " (#" + id + ")" + `</span>
        </label>
      </div>`;
    }

  }




 upgradechainhtml += `

               </div>
            </div>
          </div>
        </div>

        <p>Type in your password to confirm:</p>
        <span class="corner-wrapper">
          <input onchange="upgradechainpasswordchanged();" type="password" id="upgradechain-password" value="" class="trans-02s trans-color trans-box-shadow">
          <span class="corner corner-top-left"></span>
          <span class="corner corner-top-right"></span>
          <span class="corner corner-bottom-left"></span>
          <span class="corner corner-bottom-right"></span>
        </span>

        
        <span class="submit-wrapper js-back back left active">
          <span class="submit-hover trans-02s trans-opacity"></span>
          <input id="upgradechainback" onClick="upgradechainbackbut();" type="button" value="BACK" class="trans-02s trans-color trans-background">
        </span>
        <span class="submit-wrapper js-submit right disabled">
          <span class="submit-hover trans-02s trans-opacity"></span>
          <input type="hidden" id="upgradechain_selected_pledge" value="">
          <input type="hidden" id="upgradechain_selected_ccu" value="">
          <input id="upgradechainapply" style="display: none;" onClick="upgradechainapplybut();" type="button" value="APPLY" class="trans-02s trans-color trans-background">
        </span>
     </div>

      
    </div></form>
  </div>
    <div class="separator"></div>
  </div>
</div>
      </div>
  <div class="bottom-border">
    <div class="h-border"></div>
    <div class="l-corner"></div>
    <div class="r-corner"></div>
        <img src="https://cdn.robertsspaceindustries.com/static/images/modal_blue_line.png">
      </div>
</div>
</div>
  `;


  document.getElementById("upgradechainblock").innerHTML = upgradechainhtml;

  document.getElementById('upgradechain_search_ship').addEventListener('keyup', e => {
      upgradechain_search_ship_func();
  });

  document.getElementById('upgradechain_search_ccu').addEventListener('keyup', e => {
      upgradechain_search_ccu_func();
  });

  // Update chain button

  /*$('<span>', { class: 'shadow-button trans-02s trans-color upgradechain', id: 'upgradechain'}).append(
    $('<span>', { class: 'icon trans-02s' }),
    $('<span>', { class: 'label js-label trans-02s', id: 'upgradechaintxt', value: 'upgradechain'}).text("Update chain"),
    $('<span>', { class: 'left-section'}),
    $('<span>', { class: 'right-section'})
  ).insertAfter('.title').parent('.top');^/

  /*var toprow = $('.top');
  toprow.append(
  $('<span>', { class: 'shadow-button trans-02s trans-color upgradechain', id: 'upgradechain'}).append(
    $('<span>', { class: 'icon trans-02s' }),
    $('<span>', { class: 'label js-label trans-02s', id: 'upgradechaintxt', value: 'upgradechain'}).text("Update chain"),
    $('<span>', { class: 'left-section'}),
    $('<span>', { class: 'right-section'})
  ));*/




  HangarXPLOR.Render();
  HangarXPLOR.BindBulkUI();
  HangarXPLOR.RefreshBulkUI();
  HangarXPLOR.RefreshPager();
}


function replaceStrangeTxts(name) {
  name = name.replace("- LTI", "");
  name = name.replace("- IAE", "");
  name = name.replace("- ILW", "");
  name = name.replace("- 120m", "");
  name = name.replace("- 24m", "");
  name = name.replace("- 6m", "");
  name = name.replace("- 10 Year", "");
  name = name.replaceAll(".", "");
  name = name.trim();

  return name;
}