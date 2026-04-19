const addLoadLogElement = async () => {
  await delay(3000);
  var obj = document.getElementById('pledge-log');
  var inHtml = obj.innerHTML;
  var addButton = '<h2><span class="icon"></span>AUTOLOAD HANGAR LOG</h2><br><span class="loadalllogs shadow-button trans-02s trans-color" id="loadLogs"><span class="icon trans-02s"></span><span class="label js-label trans-02s">Load selected logs</span><span class="left-section"></span><span class="right-section"></span></span>&nbsp;&nbsp;<span id="pagestoloadtxt">Load pages <b>FROM</b>: &nbsp&nbsp;</span><input class="inputlogs trans-02s trans-color trans-box-shadow" type=number id=pagestoloadfrom value=1 /><span id="pagestoloadtxt2">&nbsp;&nbsp;<b>TO</b>: &nbsp&nbsp;</span><input class="inputlogs trans-02s trans-color trans-box-shadow" type=number id=pagestoloadto value=50 /><br>&nbsp;&nbsp;&nbsp;&nbsp;<span id="pagestoloadtxt3"><b>*</b><i>Strongly recommend to not load more than 50 pages at time! (or be ready to very long loading)</i></span>';
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
  document.getElementById('exportlogs').style.display = "none";

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
  document.getElementById('exportlogs').style.display = "";
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


    var logbuffer = "";
    logbuffer = logbuffer + removeTags(document.getElementById('logsArea').innerHTML);

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(logbuffer));
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