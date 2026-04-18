
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._buybackPageNo = 1;
HangarXPLOR._buybackPageCount = 100;
HangarXPLOR._buybackTotalRecords = 0;
HangarXPLOR._buybackSearchTerm = '';
HangarXPLOR._buybackPagerCallbacks = HangarXPLOR._buybackPagerCallbacks || [];

// Default RefreshBuybackPager - will be called by callbacks set up in DrawBuybackUI
HangarXPLOR.RefreshBuybackPager = HangarXPLOR.RefreshBuybackPager || function() {
  for (var i = 0, j = HangarXPLOR._buybackPagerCallbacks.length; i < j; i++) {
    HangarXPLOR._buybackPagerCallbacks[i]();
  }
};

/**
 * Renders buyback items that match the search, filter and sort criteria
 */
HangarXPLOR.RenderBuyback = function() {
  var filterBy = 'js-buyback-filter';
  var sortBy = 'js-buyback-sort';
  var searchBy = 'js-custom-search';  // Uses shared search class like hangar page

  HangarXPLOR.Log('Rendering buyback', filterBy, sortBy, searchBy, HangarXPLOR._buybackPageNo, HangarXPLOR._buybackPageCount);

  filterBy = '.' + filterBy;
  sortBy = '.' + sortBy;
  searchBy = '#buybackSearchInput';  // Use ID for buyback search to avoid conflict with hangar

  var bbbuffer = HangarXPLOR._buybackInventory;

  // Apply filters
  $(filterBy).each(function() {
    bbbuffer = HangarXPLOR.FilterBuyback(bbbuffer, $(this).val());
  });

  // Apply search
  $(searchBy).each(function() {
    var searchTerm = $(this).val();
    if (searchTerm && searchTerm.trim().length > 0) {
      HangarXPLOR._buybackSearchTerm = searchTerm.toLowerCase();
      bbbuffer = $.grep(bbbuffer, function(item) {
        return item.buyback_name.toLowerCase().indexOf(HangarXPLOR._buybackSearchTerm) > -1 ||
               item.buyback_type.toLowerCase().indexOf(HangarXPLOR._buybackSearchTerm) > -1 ||
               item.contained.toLowerCase().indexOf(HangarXPLOR._buybackSearchTerm) > -1;
      });
    }
  });

  // Apply sort
  $(sortBy).each(function() {
    bbbuffer = HangarXPLOR.SortBuyback(bbbuffer, $(this).val());
  });

  HangarXPLOR._buybackFiltered = bbbuffer;

  // User performed search & no results
  if (
    HangarXPLOR._buybackInventory.length > 0 &&
    bbbuffer.length === 0 &&
    HangarXPLOR._buybackSearchTerm.length !== 0
  ) {
    var $noResults = $('<li>').append(
      $('<h4>', { class: 'empty-list', text: 'Your search returned no results.' })
    );
    bbbuffer = [$noResults[0]];
  }
  // Empty Buffer
  else if (bbbuffer.length == 0) {
    var $empty = $('<li>').append(
      $('<h4>', { class: 'empty-list', text: 'Your buyback queue is empty.' })
    );
    bbbuffer = [$empty[0]];
  }

  HangarXPLOR._buybackTotalRecords = buffer.length;

  var maxPages = Math.ceil(HangarXPLOR._buybackTotalRecords / HangarXPLOR._buybackPageCount);
  if (HangarXPLOR._buybackPageNo > maxPages) HangarXPLOR._buybackPageNo = Math.max(1, maxPages);

  // Apply pagination
  if (HangarXPLOR._buybackPageCount < 1000) {
    bbbuffer = bbbuffer.slice(
      (HangarXPLOR._buybackPageNo - 1) * HangarXPLOR._buybackPageCount,
      HangarXPLOR._buybackPageNo * HangarXPLOR._buybackPageCount
    );
  }

  HangarXPLOR.$list.empty();
  HangarXPLOR.$list.append(bbbuffer);

  // Update pager display (uses callback system defined in DrawBuybackUI.js)
  HangarXPLOR.RefreshBuybackPager();
};
