
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._callbacks = HangarXPLOR._callbacks || {};
HangarXPLOR._exportByName = HangarXPLOR._exportByName || {};

(function() {

  var $download = $('<a />');
  $download.hide();
  $(document.body).append($download);
  
  
  $.ajax({
    url: $('#HangarXPLOR-ajax-ship-codes-json').data('ajax'),
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      $.map(data, (ship) => { HangarXPLOR._exportByName[ship.ship_name.toLowerCase()] = ship });
    }
  });

  HangarXPLOR.GetShipList = function($target) {
    
    return $target.map(function() { 
      var $pledge = this;
      var pledge = {};
      pledge.name = $('.js-pledge-name', $pledge).val();
      pledge.id = $('.js-pledge-id', $pledge).val();
      pledge.cost = $('.js-pledge-value', $pledge).val();
      pledge.lti = $('.title:contains(Lifetime Insurance)', $pledge).length > 0;
      pledge.date = $('.date-col:first', $pledge).text().replace(/created:\s+/gi, '').trim();
      pledge.warbond = pledge.name.toLowerCase().indexOf('warbond') > -1;

      return $('.kind:contains(Ship)', this).parent().map(function() {
        var $ship = this;
        var ship_orig_name = $('.title', $ship).text();
        var ship_name = $('.title', $ship).text().trim();
        ship_name = ship_name.replace(/^(?:Aegis|Anvil|Aopoa|Banu|CNOU|Crusader|Drake|Greycat Industrial|Greycat|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '').trim();
        var lookup = ship_name.toLowerCase();
        var nickname = $('.custom-name-text', $ship).text();
        var i, j;
        
        for (i = 0, j = HangarXPLOR._shipMatrix.length; i < j; i++) {
          if (lookup.indexOf(HangarXPLOR._shipMatrix[i].name.toLowerCase()) > -1 || lookup.indexOf((HangarXPLOR._shipMatrix[i].displayName || 'NOTFOUND').toLowerCase()) > -1) {

            HangarXPLOR.Log('Matched', HangarXPLOR._shipMatrix[i].name, 'in', lookup);

            lookup = (HangarXPLOR._shipMatrix[i].export || HangarXPLOR._shipMatrix[i].name).toLowerCase().trim();
            break;
          }
        }
        
        var ship = HangarXPLOR._exportByName[lookup] || {
          unidentified: 'Please report this ship to the plugin developers at https://github.com/dolkensp/HangarXPLOR/issues',
          ship_code: ($('.liner span', $ship).text().trim() + '_' + ship_name).replace(/[^a-z0-9]/gi, '_').replace(/__+/gi, '_'),
          manufacturer_name: $('.liner', $ship).text().trim().replace(/\(.*\)/, '').trim(),
          lookup: lookup,
        };
        
        ship.manufacturer_code = $('.liner span', $ship).text().trim();
        ship.lti         = pledge.lti;
        ship.name        = ship_name;
        ship.orig_name   = ship_orig_name;
        ship.warbond     = pledge.warbond;
        ship.entity_type = 'ship';
        ship.ship_name   = nickname.length > 0 ? nickname : ship.ship_name;
        ship.pledge_id   = pledge.id;
        ship.pledge_name = pledge.name;
        ship.pledge_date = pledge.date;
        ship.pledge_cost = pledge.cost;

        var searchArr = ship_name.toLowerCase().split(" ");
        ship.ccud = true;
        var inc = false;
        for (i = 0; i < searchArr.length; i++) {
          inc = true;
          searchArr[i] = searchArr[i].toLowerCase().replaceAll('.', '');
          if(ship.name.toLowerCase().includes(searchArr[i])) {
            ship.ccud = false;
          }
        }
        if(!inc) {
          search_ship_name = ship_name.toLowerCase().replaceAll('.', '');
          if(ship.name.toLowerCase().includes(search_ship_name)) {
            ship.ccud = false;
          }
        }
        
        return ship;
      }).get()
    }).sort(function(a, b) { return a.manufacturer == b.manufacturer ? (a.name < b.name ? -2 : 2) : (a.manufacturer < b.manufacturer ? -1 : 1); }).get();
  }

  HangarXPLOR.GetPledgeList = function($target) {
    
    return $target.map(function() { 
      var $pledge = this;
      var pledge = {};
      pledge.name = $('.js-pledge-name', $pledge).val();
      pledge.id = $('.js-pledge-id', $pledge).val();
      pledge.cost = $('.js-pledge-value', $pledge).val();
      pledge.lti = $('.title:contains(Lifetime Insurance)', $pledge).length > 0;
      pledge.date = $('.date-col:first', $pledge).text().replace(/created:\s+/gi, '').trim();
      pledge.warbond = pledge.name.toLowerCase().indexOf('warbond') > -1;
      pledge.ship = false;

      pledge.price = pledge.cost.replace('$', '').replace('USD', '').replace(' ', '').trim();

      if(pledge.name.toLowerCase().includes('gear')) {
        pledge.gear = true;
      } else{
        pledge.gear = false;
      }

      if(pledge.name.toLowerCase().includes('upgrade')) {
        pledge.upgrade = true;
      } else {
        pledge.upgrade = false;
      }

      pledge.ship = false;
      pledge.ship_name = '';
      pledge.manufacturer_code = '';
      pledge.manufacturer_name = '';
      pledge.lookup = '';
      pledge.ship_code = '';
      pledge.orig_name = '';
      pledge.nickname = '';

      $('.kind:contains(Ship)', this).parent().map(function() {
        var $ship = this;
        var ship_name = $('.title', $ship).text().trim();

        var ship_orig_name = $('.title', $ship).text();
        var ship_name = $('.title', $ship).text().trim();
        ship_name = ship_name.replace(/^(?:Aegis|Anvil|Aopoa|Banu|CNOU|Crusader|Drake|Greycat Industrial|Greycat|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '').trim();
        var lookup = ship_name.toLowerCase();
        var nickname = $('.custom-name-text', $ship).text();
        var i, j;
        
        for (i = 0, j = HangarXPLOR._shipMatrix.length; i < j; i++) {
          if (lookup.indexOf(HangarXPLOR._shipMatrix[i].name.toLowerCase()) > -1 || lookup.indexOf((HangarXPLOR._shipMatrix[i].displayName || 'NOTFOUND').toLowerCase()) > -1) {
  
            HangarXPLOR.Log('Matched', HangarXPLOR._shipMatrix[i].name, 'in', lookup);
  
            lookup = (HangarXPLOR._shipMatrix[i].export || HangarXPLOR._shipMatrix[i].name).toLowerCase().trim();
            break;
          }
        }
        
        var ship = HangarXPLOR._exportByName[lookup] || {
          unidentified: 'Please report this ship to the plugin developers at https://github.com/dolkensp/HangarXPLOR/issues',
          ship_code: ($('.liner span', $ship).text().trim() + '_' + ship_name).replace(/[^a-z0-9]/gi, '_').replace(/__+/gi, '_'),
          manufacturer_name: $('.liner', $ship).text().trim().replace(/\(.*\)/, '').trim(),
          lookup: lookup,
        };
        
        pledge.manufacturer_code = $('.liner span', $ship).text().trim();
        pledge.manufacturer_name = ship.manufacturer_name;
        pledge.lookup = ship.lookup;
        pledge.ship_code = ship.ship_code;
        pledge.ship_name   = nickname.length > 0 ? nickname : ship.ship_name;

        pledge.ship = true;
        
        pledge.ship_name   = ship_name;
        pledge.warbond     = pledge.warbond;
        pledge.orig_name   = ship_orig_name;

        var searchArr = ship_name.toLowerCase().split(" ");
        pledge.ccud = true;
        var inc = false;
        for (i = 0; i < searchArr.length; i++) {
          inc = true;
          searchArr[i] = searchArr[i].toLowerCase().replaceAll('.', '');
          if(pledge.name.toLowerCase().includes(searchArr[i])) {
            pledge.ccud = false;
          }
        }
        if(!inc) {
          search_ship_name = ship_name.toLowerCase().replaceAll('.', '');
          if(pledge.name.toLowerCase().includes(search_ship_name)) {
            pledge.ccud = false;
          }
        }
        
      }).get();
      return pledge;
    }).get();
  }

  HangarXPLOR._callbacks.ExportHangarJSON = function(e) {
    e.preventDefault();

    var d = new Date,
    formatedCurDate = [(d.getFullYear()),
               d.getMonth() + 1,
               d.getDate()].join('-') + '_' +
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join('-');
    
    // TODO: Check why
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);
    
    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(HangarXPLOR.GetPledgeList($target), null, 2)));
    $download.attr('download', 'pledgelist_' + formatedCurDate + '.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }

  HangarXPLOR._callbacks.ExportHangarCSV = function(e) {
    e.preventDefault();

    var d = new Date,
    formatedCurDate = [(d.getFullYear()),
               d.getMonth() + 1,
               d.getDate()].join('-') + '_' +
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join('-');
    
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);
    
    // TODO: CSV support will need to be careful of user-entered data...

    var buffer = "Name, Manufacture, Manufacture Code, Ship, Original name, CCUd, LTI, ID, Cost, Date\n";
    buffer = buffer + HangarXPLOR.GetPledgeList($target).map(function(pledge) { return [ '"' + pledge.name + '"', '"' + pledge.manufacturer_name + '"', '"' + pledge.manufacturer_code + '"', '"' + pledge.ship_name + '"', '"' + pledge.orig_name + '"', pledge.ccud, pledge.lti, pledge.id, pledge.price, pledge.date + '"' ].join(',')}).join('\n')

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'pledgelist_' + formatedCurDate + '.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }

  HangarXPLOR._callbacks.DownloadJSON = function(e) {
    e.preventDefault();
    
    var d = new Date,
    formatedCurDate = [(d.getFullYear()),
               d.getMonth() + 1,
               d.getDate()].join('-') + '_' +
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join('-');
    // TODO: Check why
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);
    
    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(HangarXPLOR.GetShipList($target), null, 2)));
    $download.attr('download', 'shiplist_ ' + formatedCurDate  + '.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }
  
  HangarXPLOR._callbacks.DownloadCSV = function(e) {
    e.preventDefault();

    var d = new Date,
    formatedCurDate = [(d.getFullYear()),
               d.getMonth() + 1,
               d.getDate()].join('-') + '_' +
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join('-');
    
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);
    
    // TODO: CSV support will need to be careful of user-entered data...
    var buffer = "Manufacture, Manufacture Code, Ship, Original Name, LTI, CCUd, Warbond, ID, Pledge, Cost, Date\n";
    buffer = buffer + HangarXPLOR.GetShipList($target).map(function(ship) { return [ '"' + ship.manufacturer_name + "'", "'" + ship.manufacturer_code + "'", '"' + ship.ship_name + '"', '"' + ship.orig_name + '"', ship.lti, ship.ccud, ship.warbond, ship.pledge_id, '"' + ship.pledge_name + '"', '"' + ship.pledge_cost + '"', '"' + ship.pledge_date + '"' ].join(',')}).join('\n')

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'shiplist_' + formatedCurDate + '.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }

})();


  


