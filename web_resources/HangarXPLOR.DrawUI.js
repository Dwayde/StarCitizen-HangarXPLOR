
var HangarXPLOR = HangarXPLOR || {};

const delay = ms => new Promise(res => setTimeout(res, ms));

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

  document.getElementsByClassName('pledge-log js-pledge-log')[0].addEventListener('click', addLoadLogElement);


  HangarXPLOR.Render();
  HangarXPLOR.BindBulkUI();
  HangarXPLOR.RefreshBulkUI();
  HangarXPLOR.RefreshPager();
}

const addLoadLogElement = async () => {
  await delay(3000);
  var obj = document.getElementById('pledge-log');
  var inHtml = obj.innerHTML;
  var addButton = '<h2><span class="icon"></span>HANGAR LOAD FULL LOG</h2><br><span class="loadalllogs shadow-button trans-02s trans-color" id="loadLogs"><span class="icon trans-02s"></span><span class="label js-label trans-02s">Load selected logs</span><span class="left-section"></span><span class="right-section"></span></span>&nbsp;&nbsp;<span id="pagestoloadtxt">Load pages <b>FROM</b>: &nbsp&nbsp;</span><input class="inputlogs trans-02s trans-color trans-box-shadow" type=number id=pagestoloadfrom value=1 /><span id="pagestoloadtxt2">&nbsp;&nbsp;<b>TO</b>: &nbsp&nbsp;</span><input class="inputlogs trans-02s trans-color trans-box-shadow" type=number id=pagestoloadto value=50 /><br>&nbsp;&nbsp;&nbsp;&nbsp;<span id="pagestoloadtxt3"><b>*</b><i>Strongly recommend to not load more than 50 pages at time! (or be ready to very long loading)</i></span>';
  if(!inHtml.includes(addButton)) {
     document.getElementById('pledge-log').innerHTML = addButton + inHtml;
  }
  document.getElementById('loadLogs').addEventListener('click', loadAllLogs);

  document.getElementById('loadLogs').style.display = "";
  //document.getElementsByClassName('pledge-log js-pledge-log')[0].removeEventListener('click', addLoadLogElement);
};


async function loadAllLogs() {

  //document.getElementsByClassName('scrollbar')[0].style.display = "none";
  //document.getElementsByClassName('scrollbar')[0].disabled = true;
  //document.getElementsByClassName('scrollbar')[0].remove();

  //document.getElementById('loadLogs').style.display = "none";
  //document.getElementById('pagestoloadtxt').style.display = "none";
  //document.getElementById('pagestoloadtxt2').style.display = "none";
  //document.getElementById('pagestoloadtxt3').style.display = "none";
  //document.getElementById('pagestoloadfrom').style.display = "none";

  document.getElementById("loadLogs").style.display = "none";
  document.getElementById('pagestoloadtxt').style.display = "none";
  document.getElementById('pagestoloadtxt2').style.display = "none";
  //document.getElementById('pagestoloadtxt3').style.display = "none";
  document.getElementById('pagestoloadfrom').style.display = "none";
  document.getElementById('pagestoloadto').style.display = "none";

  var pagestoloadto = Number(document.getElementById('pagestoloadto').value);
  var pagestoloadfrom = Number(document.getElementById('pagestoloadfrom').value);

  const area = document.getElementsByClassName('scrollable fancy')[0];

  area.remove();

  var element =  document.getElementById('logsArea');
  if (typeof(element) != 'undefined' && element != null)  {    element.remove();  }

  var element =  document.getElementById('exportlogs');
  if (typeof(element) != 'undefined' && element != null)  {    element.remove();  }

  var element =  document.getElementById('infototallogs');
  if (typeof(element) != 'undefined' && element != null)  {    element.remove();  }

  const parent = document.getElementById('pledge-log');
  const padder = parent.querySelector('.padder');
  const target = padder.querySelector('.separator');

  const newEl = document.createElement('div')
  newEl.id = 'logsArea';
  newEl.classList.add('logsArea');
  newEl.classList.add('scrollable');
  newEl.classList.add('fancy');

  newEl.style = "overflow-y: scroll;";

  $('<span>', { class: 'exportlogs shadow-button trans-02s trans-color', id: 'exportlogs'}).append(
    $('<span>', { class: 'icon trans-02s' }),
    $('<span>', { class: 'label js-label trans-02s'}).text("Export csv"),
    $('<span>', { class: 'left-section'}),
    $('<span>', { class: 'right-section'})
  ).insertAfter('.head').parent('.padder').parent('#pledge-log');

  document.getElementById('exportlogs').addEventListener('click', exportlogs);

    $('<span>', { class: 'infototallogs', id: 'infototallogs'}).append(
  ).insertAfter('.exportlogs').parent('.padder').parent('#pledge-log');

  target.after(newEl);

  var pageTotal = 1;
  var responsePages = 1;

  await fetch("https://robertsspaceindustries.com/api/account/pledgeLog?page=1", {
    method: 'POST',
    headers: new Headers({
        "Authorization": localStorage.getItem('token'),
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "cookie": document.cookie,
        "X-Rsi-Token": getRsiToken()
    }),
  }).then((response) => response.json()).then(responseData => { 
    pageTotal = responseData['data']['pagecount'];
    responsePages = pageTotal;

  }).catch(error => {console.log(error);})

  if(pagestoloadto > pageTotal) {
      document.getElementById('pagestoloadto').value = pageTotal;
      pagestoloadto = pageTotal;
  } else {
      pageTotal = pagestoloadto;
  }

  if(pagestoloadfrom < 1) { pagestoloadfrom = 1; document.getElementById('pagestoloadfrom').value = 1 }
  var startpage = pagestoloadfrom;

  var totalpages = 1;
  document.getElementById('infototallogs').innerHTML = "&nbsp;&nbsp;<br>Total loaded (<b>"+startpage+"-"+pageTotal+" of " + responsePages + "</b> pages):<b> " + totalpages + "/" + (pageTotal - startpage + 1) + "</b> pages (<font color=#00f0ff><b>Starting...</b></font>)";

  for (var logpage = startpage; logpage <= pageTotal; logpage++) {
    console.log("Log page " + logpage + " loading!");
    await getLogPage(logpage);
    console.log("Log page " + logpage + " loaded!");
    document.getElementById('infototallogs').innerHTML = "&nbsp;&nbsp;<br>Total loaded (<b>"+startpage+"-"+pageTotal+" of " + responsePages + "</b> pages):<b> " + totalpages + "/" + (pageTotal - startpage + 1)  + "</b> pages (<font color=orange><b>Loading...</b></font>)";
    totalpages++;
  }

  document.getElementById('infototallogs').innerHTML = "&nbsp;&nbsp;<br>Total loaded (<b>"+startpage+"-"+pageTotal+" of " + responsePages + "</b> pages):<b> " + (totalpages - 1) + "/" + (pageTotal - startpage + 1)  + "</b> pages (<font color=#0f0><b>Completed</b></font>)";


  document.getElementById("loadLogs").style.display = "";
  document.getElementById('pagestoloadtxt').style.display = "";
  document.getElementById('pagestoloadtxt2').style.display = "";
  //document.getElementById('pagestoloadtxt3').style.display = "";
  document.getElementById('pagestoloadfrom').style.display = "";
  document.getElementById('pagestoloadto').style.display = "";

}

async function getLogPage(page) {

   await fetch("https://robertsspaceindustries.com/api/account/pledgeLog?page="+page, {
    method: 'POST',
    headers: new Headers({
        "Authorization": localStorage.getItem('token'),
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "cookie": document.cookie,
        "X-Rsi-Token": getRsiToken()
    }),
  }).then((response) => response.json()).then(responseData => { 
    var text = responseData['data']['rendered'];
    document.getElementById('logsArea').innerHTML += text;
  }).catch(error => {console.log(error);})


}


function exportlogs() {

    var $download = $('<a />');
    $download.hide();
    $(document.body).append($download);

    var d = new Date,
    formatedCurDate = [(d.getFullYear()),
               d.getMonth() + 1,
               d.getDate()].join('-') + '_' +
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join('-');


    var buffer = "";
    buffer = buffer + removeTags(document.getElementById('logsArea').innerHTML);

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'logs_' + formatedCurDate + '.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
}

function getRsiToken() {
    var theCookies = document.cookie.split(';');
    for (var i = 1 ; i <= theCookies.length; i++) {
        if(theCookies[i-1].includes('Rsi-Token')) {
          return theCookies[i-1].split("=")[1];
        }
    }
    return '';
}

function removeTags(str) {
	if ((str === null) || (str === ''))
		return false;
	else
		str = str.toString();

	// Regular expression to identify HTML tags in
	// the input string. Replacing the identified
	// HTML tag with a null string.
	return str.replace(/(<([^>]+)>)/ig, '');
}



addEventListener("wheel", (event) => { 
  if(document.getElementsByClassName('scrollbar').length > 1) {
    document.getElementsByClassName('scrollbar')[1].remove();
  }
 });