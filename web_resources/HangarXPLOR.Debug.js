
var HangarXPLOR = HangarXPLOR || {};

var delaytime = 1000; //1 second

if ($.cookie('logsEnabled') == "true") {
  HangarXPLOR.logsEnabled = true;
}

if ($.cookie('debug') == "true") {
  // Load a page of pledges from RSI
  HangarXPLOR.LoadPage = function(pageNo)
  {
    var url = HangarXPLOR._debugRoot + 'debug/hangar-' + pageNo + '.html';
    
    HangarXPLOR.Log('Loading', url);
    
    $.ajax({
      url: url,
      method: 'GET', 
      success: function(html) { HangarXPLOR.ProcessPage(html, pageNo) }, 
      error: function() { HangarXPLOR.DrawUI() }
    });
  }

  // Pre-process all the items in a document, then load the next page, or render the UI
  HangarXPLOR.ProcessPage = function(html, pageNo)
  {
    var $page = $(html);
    var $lists = $('.list-items', $page);

    // Check to see if we have 2 lists - The Hangar, and the Inventory
    if ($lists.length == 2)
    {
      var $items = $('li', $lists[1]);
        
      $items.each(HangarXPLOR.ParsePledge);
        /*if(pageNo % 10 === 0) {s
          setTimeout(function() {
            HangarXPLOR.LoadPage(pageNo + 1);
          }, delay1sec);  
        } else { */
          setTimeout(function() { // Delay to fix error with extra large hangars
            console.log("Page " + pageNo + " loading...");
            HangarXPLOR.LoadPage(pageNo + 1);
            console.log("Page " + pageNo + " loaded!");
          }, delaytime);
        //}
    } else {
      HangarXPLOR.DrawUI();
    }
  }
}