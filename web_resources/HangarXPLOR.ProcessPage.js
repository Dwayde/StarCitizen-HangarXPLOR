
var delayhalfsec = 500; //0.5 second
var delay1sec = 1000; //1 second
var delay10sec = 10000; //10 second

var HangarXPLOR = HangarXPLOR || {};

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var isEmpty = $('.list-items > li > .empy-list', $page).length > 0;
  
  var $items = $('.list-items > li', $page);
      
  if (!isEmpty) $items.each(HangarXPLOR.ParsePledge);
      
  if (isEmpty || $items.length < 10)
  {
    HangarXPLOR.SaveCache();
    HangarXPLOR.DrawUI();
  } else {
    if(pageNo % 10 === 0) {
      setTimeout(function() {
        HangarXPLOR.LoadPage(pageNo + 1);
      }, delayhalfsec);  
    } else {
      HangarXPLOR.LoadPage(pageNo + 1);
    }
  }
}
