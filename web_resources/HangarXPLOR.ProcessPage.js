

var HangarXPLOR = HangarXPLOR || {};

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var isEmpty = $('.list-items > li > .empy-list', $page).length > 0;
  
  var $items = $('.list-items > li', $page);

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
      
  if (!isEmpty) $items.each(HangarXPLOR.ParsePledge);

  if (isEmpty || $items.length < 10) {
    HangarXPLOR.SaveCache();
    HangarXPLOR.DrawUI();
  } else {
      //console.log("Page " + (pageNo) + " loading...");
      HangarXPLOR.LoadPage(pageNo + 1);
      //console.log("Page " + (pageNo) + " loaded!");
      document.getElementById("loading").textContent = "";
      if(lp == 0) {
        document.getElementById('loading').innerHTML = "Finish!";
      } else {
        document.getElementById('loading').innerHTML = "" + pageNo.toString() + "/" + lp + " pages...";
      }
  }

}
