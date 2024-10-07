
var HangarXPLOR = HangarXPLOR || {};

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



  HangarXPLOR.Render();
  HangarXPLOR.BindBulkUI();
  HangarXPLOR.RefreshBulkUI();
  HangarXPLOR.RefreshPager();
}
