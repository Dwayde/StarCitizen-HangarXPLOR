var HangarXPLOR = HangarXPLOR || {};


HangarXPLOR._BBthrottleAfterPage = 50;   // start throttling after this page number
HangarXPLOR._BBthrottleDelay     = 500;  // ms to wait between pages once throttling kicks in
HangarXPLOR._BBretryDelay        = 5000; // ms for first retry after a 429; multiplied by attempt number
HangarXPLOR._BBmaxRetries        = 5;


HangarXPLOR.LoadBuybackPage = function(pageNo, retryCount) {
  pageNo = pageNo || 1;

  HangarXPLOR.Log('Loading buyback page', pageNo);
  HangarXPLOR.UpdateStatus(pageNo);

  var url = '/account/buy-back-pledges?page=' + pageNo + '&pagesize=50';

  if (pageNo == 1 && document.location.search == '?page=1')
    return HangarXPLOR.ProcessBuybackPage(document.body, pageNo);

    HangarXPLOR.Log('Loading', url);

    var doLoad = function() {
    $.ajax({
      url: url,
      method: 'GET',
      dataType: 'html',
      success: function(data) {
        HangarXPLOR.ProcessBuybackPage(data, pageNo);
      },
      error: function(xhr) {
        if (xhr.status === 429 && retryCount < HangarXPLOR._BBmaxRetries) {
          var delay = HangarXPLOR._BBretryDelay * (retryCount + 1);
          HangarXPLOR.Log('Rate limited on page ' + pageNo + ', retrying in ' + (delay / 1000) + 's (attempt ' + (retryCount + 1) + '/' + HangarXPLOR._maxRetries + ')');
          HangarXPLOR.UpdateStatus(pageNo, 'rate-limited', retryCount + 1, delay / 1000);
          console.log('Error loading page ' + pageNo + ' of your buyback, probably anti-spam, if you have large hangar!');
          // Auto try again
          console.log('No worries we will try again in ' + ((delay - 1)/1000) + ' seconds!');
          document.getElementById("loadingstatus").innerHTML += "<br>Anti-spam, retrying...";
          setTimeout(function() { HangarXPLOR.LoadBuybackPage(pageNo, retryCount + 1); }, delay);
        } else {
          HangarXPLOR.Log('Error loading page ' + pageNo + ' of your hangar - please contact klnpotap@gmail.com for further support') 
          HangarXPLOR.UpdateStatus(pageNo, 'error');
        }
      }
    });
  };

  if (pageNo > HangarXPLOR._BBthrottleAfterPage) {
    setTimeout(doLoad, HangarXPLOR._BBthrottleDelay);
  } else {
    doLoad();
  }

}
