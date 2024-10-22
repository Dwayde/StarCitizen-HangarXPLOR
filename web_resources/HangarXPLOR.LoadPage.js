var delaytime = 60001; //60 second


var HangarXPLOR = HangarXPLOR || {};

// Load a page of pledges from RSI
HangarXPLOR.LoadPage = function(pageNo)
{
  pageNo = pageNo || 1;
  
  HangarXPLOR.UpdateStatus(pageNo);
  
  var url = '/account/pledges?page=' + pageNo;
  
  if (pageNo == 1 && document.location.search == '?page=1')
      return HangarXPLOR.ProcessPage(document.body, pageNo);
  
  HangarXPLOR.Log('Loading', url);
  
  var $page = $('<div>');
  
  $page.load(url + ' .page-wrapper', function(response, status) {
    if (status == "success") {
      HangarXPLOR.ProcessPage(this, pageNo) 
    } else {
      HangarXPLOR.Log('Error loading page ' + pageNo + ' of your hangar - please contact plugins@ddrit.com for further support') 
      console.log('Error loading page ' + pageNo + ' of your hangar, probably anti-spam, if you have large hangar!');
      /*if (confirm('Error loading page ' + pageNo + ' of your hangar, probably anti-spam, if you have large hangar! Try again in ' + ((delaytime - 1)/1000) + ' seconds?') == true) {
        console.log('Don\t worry we will try again in ' + ((delaytime - 1)/1000) + ' seconds!');
        setTimeout(function() {
          HangarXPLOR.LoadPage(pageNo);
        }, delaytime);
      } else {
        console.log('Finished! Hangar not fully loaded! [ERROR]');
      }*/
      // Auto try again
      console.log('Don\t worry we will try again in ' + ((delaytime - 1)/1000) + ' seconds!');
      setTimeout(function() {
        HangarXPLOR.LoadPage(pageNo);
      }, delaytime);

    }
  });
}