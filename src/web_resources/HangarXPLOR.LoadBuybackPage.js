var delaytime = 10001; //10 second


var HangarXPLOR = HangarXPLOR || {};

/**
 * Loads a page of buyback pledges via AJAX
 * @param {number} pageNo - The page number to load (1-indexed)
 */
HangarXPLOR.LoadBuybackPage = function(pageNo) {
  pageNo = pageNo || 1;

  HangarXPLOR.Log('Loading buyback page', pageNo);
  HangarXPLOR.UpdateStatus(pageNo);

  $.ajax({
    url: '/account/buy-back-pledges?page=' + pageNo + '&pagesize=50',
    method: 'GET',
    dataType: 'html',
    success: function(response) {
      HangarXPLOR.ProcessBuybackPage($(response), pageNo);
    },
    error: function(xhr, status, error) {
      HangarXPLOR.Log('Error loading buyback page', pageNo, status, error);

      console.log('Error loading buyback page ' + pageNo + ' of your hangar, probably anti-spam, if you have large hangar!');

      console.log('No worries we will try again in ' + ((delaytime - 1)/1000) + ' seconds!');
      document.getElementById("loading").innerHTML += "<br>Anti-spam, retrying...";
      
      // Auto try again
      setTimeout(function() {
        HangarXPLOR.LoadBuybackPage(pageNo);
      }, delaytime);
      
      // Still try to render what we have
      //HangarXPLOR.SaveBuybackCache();
      //HangarXPLOR.DrawBuybackUI();
    }
  });
};
