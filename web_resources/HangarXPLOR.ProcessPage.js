

var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._uiDrawn = HangarXPLOR._uiDrawn || false;

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var isEmpty = $('.list-items > li > .empty-list', $page).length > 0;
  
  var $items = $('.list-items > li', $page);

  // Detect duplicate pages: RSI returns the last page's results for any
  // page number beyond the actual last page instead of an empty list.
  var isDuplicate = false;
  if (!isEmpty && $items.length > 0) {
    var firstId = $('.js-pledge-id', $items.first()).val();
    if (firstId && firstId === HangarXPLOR._lastFirstPledgeId) {
      isDuplicate = true;
      console.log("Duplicate page");
    }
    HangarXPLOR._lastFirstPledgeId = firstId;
  }

  // get last page
  if($('.raquo.btn', $page).length > 0) {
    var lastpage = $('.raquo.btn', $page).attr('href');
    if(typeof lastpage !== "undefined") {
      var lp = lastpage.split("=")[1];
    } else {
      var lp = pageNo;
    }
  } else {
    var lp = pageNo;
  }

  // Check on last page
  var actualpage = $('.trans-02s.trans-color.active', $page).attr('href');
  if(typeof actualpage !== "undefined") {
    var ap = actualpage.split("=")[1];
  } else {
    var ap = 1;
  }

  if(pageNo != Number(ap)) {
    //console.log("Last page");
    isEmpty = true;
  }
   
  if (!isEmpty && !isDuplicate) $items.each(HangarXPLOR.ParsePledge);

  // Draw the UI shell on first page load so the user sees results immediately,
  // then just re-render on subsequent pages while the rest of the hangar loads.
  if (!HangarXPLOR._uiDrawn) {
    HangarXPLOR._uiDrawn = true;
    HangarXPLOR.DrawUI();
  } else {
    HangarXPLOR.Render();
    HangarXPLOR.RefreshBulkUI();
    HangarXPLOR.RefreshPager();
    updateApplyUpgradesUI();
  }   

  if (isEmpty || $items.length < 10) {
    HangarXPLOR.SaveCache();
    HangarXPLOR.MarkLoadingComplete();
  } else {
      //console.log("Page " + (pageNo) + " loading...");
      HangarXPLOR.LoadPage(pageNo + 1, 0);
      //console.log("Page " + (pageNo) + " loaded!");
      document.getElementById("loadingstatus").textContent = "";
      if(lp == 0) {
        document.getElementById('loadingstatus').innerHTML = "Loading Finish!";
      } else {
        document.getElementById('loadingstatus').innerHTML = "Loading " + pageNo.toString() + "/" + lp + " pages...";
      }
  }

}
