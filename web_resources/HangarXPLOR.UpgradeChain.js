var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._callbacks = HangarXPLOR._callbacks || {};


HangarXPLOR._callbacks.UpgradeChain = function(e) {
    e.preventDefault();
    document.getElementById("upgradechainblock").style.display = "block";

}
  

function closeupgradechain() {

    document.getElementById("upgradechain_search_ship").value = "";
    document.getElementById("upgradechain_search_ccu").value = "";

    document.getElementById("upgradechain-step1").style.display = "block";
    document.getElementById("upgradechain-step2").style.display = "none";

    document.getElementById("upgradechain-password").value = "";

    document.getElementById("upgradechainapply").style.display = "none";
    document.getElementById("upgradechainnext").style.display = "none";

    document.getElementById("showingall").style.display = "none";
    document.getElementById("ccu_noresults").style.display = "none";
    document.getElementById("pledge_noresults").style.display = "none";

    resetShip();

    resetCCU();

    document.getElementById("upgradechainblock").style.display = "none";
    if(document.getElementById("upgradechain_refresh").value === 1 || document.getElementById("upgradechain_refresh").value === "1") {
        window.location.reload();
    }
}
function upgradechainnextbut() {
    document.getElementById("upgradechain-step1").style.display = "none";
    document.getElementById("upgradechain-step2").style.display = "block";
}
function upgradechainbackbut() {


    var all_ccus = document.getElementsByClassName("upgradechain-ccu-row")
    
    for(var i = 0; i < all_ccus.length; i++) {
        if(all_ccus[i].classList.contains("selected")) {
            all_ccus[i].classList.remove("selected");
        }
    }

    document.getElementById("upgradechain_search_ccu").value = "";

    document.getElementById("upgradechain_ship_result").innerHTML = "";

    document.getElementById("upgradechain-step1").style.display = "block";
    document.getElementById("upgradechain-step2").style.display = "none";

    document.getElementById("showingall").style.display = "none";
    document.getElementById("ccu_noresults").style.display = "none";
    document.getElementById("pledge_noresults").style.display = "none";
    
}

async function upgradechainapplybut() {

    document.getElementById("upgradechainapply").style.display = "none";

    var pledge_id = document.getElementById("upgradechain_selected_pledge").value;
    var ccu_id = document.getElementById("upgradechain_selected_ccu").value;
    var password = document.getElementById("upgradechain-password").value;

    
    await fetch("https://robertsspaceindustries.com/api/account/applyUpgrade", {
    method: 'POST',
    headers: new Headers({
        "Authorization": localStorage.getItem('token'),
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "cookie": document.cookie,
        "X-Rsi-Token": getRsiToken(),
    }),
    body: JSON.stringify({
        "pledge_id": pledge_id,
        "upgrade_id": ccu_id,
        "current_password": password,
    }),
  }).then((response) => response.json()).then(responseData => { 
    response = responseData;

  }).catch(error => {console.log(error);})


    console.log(response);

    if(response['success'] === 0) {

        document.getElementsByClassName("upgradechain-errors")[0].innerHTML = response['msg'];
        document.getElementsByClassName("upgradechain-errors")[0].style.display = "block";

        await delay(3000);

        document.getElementsByClassName("upgradechain-errors")[0].innerHTML = "";
        document.getElementsByClassName("upgradechain-errors")[0].style.display = "none";

        document.getElementById("upgradechainapply").style.display = "block";

    } else {

        var result_ship = document.getElementById("upgradechain_ship_result").innerHTML;
        document.getElementById("upgradechain_ship_delete").innerHTML = result_ship;
        document.getElementById("upgradechain_ship_result").innerHTML = "";

        document.getElementById("upgradechain_selected_pledge_name").value = result_ship;

        document.getElementById("upgradechain-selected-pledge").innerHTML = document.getElementById("upgradechain_ship_to_" + ccu_id.toString()).value + " (#" +  pledge_id + ")";

        document.getElementById("upgradechain_refresh").value = 1;

        var all_ccus = document.getElementsByClassName("upgradechain-ccu-row")

        for(var i = 0; i < all_ccus.length; i++) {
            if(all_ccus[i].classList.contains("selected")) {
                all_ccus[i].remove();
            }
        }

        var all_elems = document.getElementsByClassName("upgradechain-pledge-row")

        for(var i = 0; i < all_elems.length; i++) {
            if(all_elems[i].classList.contains("selected")) {
                const t_ar = all_elems[i].id.split("-");
                var id = t_ar[2];

                var orig_ship = document.getElementById("upgradechain_ship_" + t_ar[2].toString()).value;

                document.getElementById("upgradechain_ship_span_" + t_ar[2].toString()).innerHTML = "Standalone Ships - " + orig_ship + " Ship: " + result_ship + " (#" + id + ")";
            }
        }

        sortCCU(result_ship);

        document.getElementsByClassName("upgradechain-msg")[0].innerHTML = "Success";
        document.getElementsByClassName("upgradechain-msg")[0].style.display = "block";

        await delay(3000);

        document.getElementsByClassName("upgradechain-msg")[0].innerHTML = "";
        document.getElementsByClassName("upgradechain-msg")[0].style.display = "none";

        document.getElementById("upgradechainapply").style.display = "none";

    }



}

function upgradechain_search_ship_func() {

    var all_elems = document.getElementsByClassName("upgradechain-pledge-row")

    for(var i = 0; i < all_elems.length; i++) {
        if(all_elems[i].classList.contains("selected")) {
            all_elems[i].classList.remove("selected");
        }
    }

    document.getElementById("upgradechain_ship_delete").innerHTML = "";

    document.getElementById("upgradechain-selected-pledge").innerHTML = "";

    document.getElementById("upgradechain_selected_pledge").value = "";

    document.getElementById("upgradechain_selected_pledge_name").value = "";


    var ship_search_input = String(document.getElementById("upgradechain_search_ship").value);

    ship_search_input = ship_search_input.toLowerCase();

    var all_elems = document.getElementsByClassName("upgradechain-pledge-row")

    var show = 0;
    
    for(var i = 0; i < all_elems.length; i++) {
        const t_ar = all_elems[i].id.split("-");
        var id = t_ar[2];
        var fullname = String(document.getElementById("upgradechain_ship_span_" + id.toString()).innerHTML);

        fullname = fullname.toLowerCase();

        if(fullname.includes(ship_search_input)) {
            all_elems[i].style.display = "block";
            show++;
        } else {
            all_elems[i].style.display = "none";
        }

    }

    if(show === 0) {
        document.getElementById("pledge_noresults").style.display = "block";
    } else {
        document.getElementById("pledge_noresults").style.display = "none";
    }


}

function upgradechain_search_ccu_func() {

    var all_ccus = document.getElementsByClassName("upgradechain-ccu-row")

    for(var i = 0; i < all_ccus.length; i++) {
        if(all_ccus[i].classList.contains("selected")) {
            all_ccus[i].classList.remove("selected");
        }
    }
    
    document.getElementById("upgradechain_ship_result").innerHTML = "";

    document.getElementById("upgradechain_selected_ccu").value = "";

    var ccu_search_input = String(document.getElementById("upgradechain_search_ccu").value).trim();

    ccu_search_input = ccu_search_input.toLowerCase();

    var selected_ship = document.getElementById("upgradechain_selected_pledge_name").value

    selected_ship = selected_ship.toString().toLowerCase();

    var all_ccus = document.getElementsByClassName("upgradechain-ccu-row")

    var show = 0
    
    for(var i = 0; i < all_ccus.length; i++) {
        const t_ar = all_ccus[i].id.split("-");
        var id = t_ar[2];
        var fullname = String(document.getElementById("upgradechain_ccu_span_" + id.toString()).innerHTML);

        var item_ship_from = document.getElementById("upgradechain_ship_from_" + id.toString()).value;

        fullname = fullname.toLowerCase();

        if(ccu_search_input === "") {
            if(item_ship_from.toString().toLowerCase().includes(selected_ship)) {
                all_ccus[i].style.display = "block";
                show++;
            } else {
                all_ccus[i].style.display = "none";
            }
        } else {
            if(!item_ship_from.toString().toLowerCase().includes(selected_ship)  || !fullname.includes(ccu_search_input)) {
                all_ccus[i].style.display = "none";
            }
            if(item_ship_from.toString().toLowerCase().includes(selected_ship) && fullname.includes(ccu_search_input)) {
                all_ccus[i].style.display = "block";
                show++;
            }
        }

    }

    if(show === 0) { 

        var all_ccus = document.getElementsByClassName("upgradechain-ccu-row");

        for(var i = 0; i < all_ccus.length; i++) {

            const t_ar = all_ccus[i].id.split("-");
            var id = t_ar[2];
            var fullname = String(document.getElementById("upgradechain_ccu_span_" + id.toString()).innerHTML);

            var item_ship_from = document.getElementById("upgradechain_ship_from_" + id.toString()).value;

            fullname = fullname.toLowerCase();

            if(fullname.includes(ccu_search_input)) {
                all_ccus[i].style.display = "block";
                show++;
            } else {
                all_ccus[i].style.display = "none";
            }
            
        }
        
        if(show !== 0) {
            document.getElementById("showingall").style.display = "block";
            document.getElementById("ccu_noresults").style.display = "none";
        } else {
            document.getElementById("showingall").style.display = "none";
            document.getElementById("ccu_noresults").style.display = "block";
        }
    } else {
        document.getElementById("showingall").style.display = "none";
        document.getElementById("ccu_noresults").style.display = "none";
    }

    checkApplyAvailable();


}

function checkApplyAvailable() {
    if(document.getElementById('upgradechain-password').value !== "") {
        if(document.getElementById("upgradechain_selected_ccu").value != "") {
            if(document.getElementById("upgradechain_selected_pledge").value != "") {
                document.getElementById("upgradechainapply").style.display = "block";
            } else {
                document.getElementById("upgradechainapply").style.display = "none";
            }
        } else {
            document.getElementById("upgradechainapply").style.display = "none";
        }
    } else {
        document.getElementById("upgradechainapply").style.display = "none";
    }
}

function upgradechainpasswordchanged() {
    checkApplyAvailable();
}

function upgradechain_selectccu(id) {

    var selected_elem = document.getElementById("upgrade-ccurow-" + id.toString());


    var all_ccus = document.getElementsByClassName("upgradechain-ccu-row")
    
    for(var i = 0; i < all_ccus.length; i++) {
        if(all_ccus[i].classList.contains("selected")) {
            all_ccus[i].classList.remove("selected");
        }
    }

    document.getElementById("upgradechain_ship_result").innerHTML = document.getElementById("upgradechain_ship_to_" + id.toString()).value;

    document.getElementById("upgradechain_selected_ccu").value = id;

    selected_elem.classList.add('selected');

    checkApplyAvailable();


}

function upgradechain_selectpledge(id) {


    var selected_elem = document.getElementById("upgrade-row-" + id.toString());

    var selected_ship = document.getElementById("upgradechain_ship_" + id.toString()).value;

    var all_elems = document.getElementsByClassName("upgradechain-pledge-row")
    
    for(var i = 0; i < all_elems.length; i++) {
        if(all_elems[i].classList.contains("selected")) {
            all_elems[i].classList.remove("selected");
        }
    }

    document.getElementById("upgradechain_ship_delete").innerHTML = selected_ship;

    document.getElementById("upgradechain-selected-pledge").innerHTML = selected_ship + " (#" +  id + ")";

    document.getElementById("upgradechain_selected_pledge").value = id;

    sortCCU(selected_ship);

    document.getElementById("upgradechain_selected_pledge_name").value = selected_ship;

    selected_elem.classList.add('selected');
    document.getElementById("upgradechainnext").style.display = "block";


}

function sortCCU(ship_from) {

    ship_from = ship_from.toString().toLowerCase();

    document.getElementById("upgradechain_search_ccu").value = '';

    var all_ccus = document.getElementsByClassName("upgradechain-ccu-row")

    var show = 0;
    
    for(var i = 0; i < all_ccus.length; i++) {
        const t_ar = all_ccus[i].id.split("-");
        var id = t_ar[2];
        var item_ship_from = document.getElementById("upgradechain_ship_from_" + id.toString()).value;

        if(!item_ship_from.toString().toLowerCase().includes(ship_from)) {
            all_ccus[i].style.display = "none";
        } else {
            all_ccus[i].style.display = "block";
            show++;
        }

    }

    if(show === 0) {
        document.getElementById("ccu_noresults").style.display = "block";
    } else {
        document.getElementById("ccu_noresults").style.display = "none";
    }

}

function resetShip() {

    document.getElementById("upgradechain_ship_delete").innerHTML = "";

    document.getElementById("upgradechain-selected-pledge").innerHTML = "";

    document.getElementById("upgradechain_selected_pledge").value = "";

    document.getElementById("upgradechain_selected_pledge_name").value = "";

    
    var all_elems = document.getElementsByClassName("upgradechain-pledge-row")
    
    for(var i = 0; i < all_elems.length; i++) {
        if(all_elems[i].classList.contains("selected")) {
            all_elems[i].classList.remove("selected");
        }
        all_elems[i].style.display = "block";
    }

    resetCCU();
}

function resetCCU() {

    document.getElementById("upgradechain_ship_result").innerHTML = "";

    document.getElementById("upgradechain_selected_ccu").value = "";
    
    var all_ccus = document.getElementsByClassName("upgradechain-ccu-row")
    
    for(var i = 0; i < all_ccus.length; i++) {
        if(all_ccus[i].classList.contains("selected")) {
            all_ccus[i].classList.remove("selected");
        }
        all_ccus[i].style.display = "block";
    }

}

function replaceStrangeTxts(name) {
  name = name.replace("- LTI", "");
  name = name.replace("- IAE", "");
  name = name.replace("- ILW", "");
  name = name.replace("- 120m", "");
  name = name.replace("- 24m", "");
  name = name.replace("- 6m", "");
  name = name.replace("- 10 Year", "");
  name = name.replaceAll(".", "");
  name = name.trim();

  return name;
}


function updateApplyUpgradesUI() {
    var upgradechainhtml = ``;
  upgradechainhtml += 
  `
  <input type="hidden" id="upgradechain_refresh" value=0 />
  <input type="hidden" id="upgradechain_selected_pledge_name" value="" />
  <div class="shader js-shader" style="opacity: 1;"></div>
  <div class="content js-content" style="display: block; margin-left: 8px; margin-top: 10px; opacity: 1;">
  <div class="modal-wrapper" style="margin-top: 1% !important; width: 624px;">
  <div class="top-border">
        <img src="https://cdn.robertsspaceindustries.com/static/images/modal_blue_line.png">
        <div class="h-border"></div>
    <div class="l-corner"></div>
    <div class="r-corner"></div>
  </div>
  <div class="modal-inner">
    <span onClick="closeupgradechain();" class="close trans-03s .trans-opacity"></span>
    <div id="upgrade" class="inner-content" style="">
  <h2><span class="icon"></span>APPLY CHAIN OF UPGRADEs</h2>
  <div class="upgradepadder">
    <div class="separator"></div>
    <div class="clearfix">
      <form id="upgradechaain-pledge" action="" method="POST" class="legacy-form">
        <div class="upgradechain-errors error-message js-error-message"></div>
        <div class="upgradechain-msg success-message js-success-message"></div>

        <p class="upgradehead">You are about to create upgrade for your pledge. This will <span class="important">delete the upgrade from your account</span> and apply the upgrade to the selected pledge by replacing ship.<br><br>
        You can <span class="important">apply upgrades one after another to same pledge</span> or/and complete multiple upgrade chains one after another <span class="important">without requirment to reload page</span> each time.</p>
       
        <p class="warning">WARNING! This action is PERMANENT and cannot be undone.</p>
        <div class="pane-selection">
          <span>Selected pledge:</span>
          <p id="upgradechain-selected-pledge" class="selected-pledge js-selected-pledge"></p>
          <ul class="remove">
          <p class="heading">Replace</p>
                      <li><del id="upgradechain_ship_delete"></del></li>
                    </ul>
                    <ul class="add">
          <p class="heading">With</p>
                      <li><ins id="upgradechain_ship_result"></ins></li>
                    </ul>
        <div class="clear"></div>
      </div>
    <div class="panes" style="left: 0px;">
        <div style="padding-top: 0px;" id="upgradechain-step1" class="pane step1">
        <p>Please <span class="important">select</span> the pledge on which you want to apply the upgrades to:</p>
        <div class="js-custom-controls upgradechain-custom-controls">
          <input onchange="upgradechain_search_ship_func();" id="upgradechain_search_ship" class="js-custom-search upgradechain-custom-search" placeholder="Search ships"/>
        </div>
        <p id="pledge_noresults" style="display: none;">No results found</p>
          <div class="upgradeviewport" style="overflow-y: visible; height: 175px;">
            <div class="upgradecontent" style="top: 0px;">
              <div class="upgrade-pledge-rows">`;

  
  var items_buffer = HangarXPLOR._inventory;

  for (var i = 0, j = HangarXPLOR._inventory.length; i < j; i++) { 
    if(HangarXPLOR._inventory[i].filters.is_ship) {
      var id = HangarXPLOR._inventory[i].pledge_id;
      var name = HangarXPLOR._inventory[i].displayName;
      name = replaceStrangeTxts(name);
      let name_ar = name.split('[');
      if(name_ar.length > 1) {
        name = name_ar[0].trim();
      }
      var fullname = HangarXPLOR._inventory[i].pledge_name;
      upgradechainhtml += `
      <div id="upgrade-row-` + id + `" class="upgradechain-pledge-row row">
        <label onClick="upgradechain_selectpledge(` + id + `);" for="upgrade-radio-` + id + `">
          <input id="upgradechain_ship_` + id + `" type=hidden value="` + name + `"/>
          <input id="upgrade-radio-`+ id + `" name="pledge_id" type="radio" value="` + id + `">
          <span id="upgradechain_ship_span_` + id + `">` + fullname;
        if(!fullname.includes(name)) {
          upgradechainhtml += " Ship: " + name;
        }
        upgradechainhtml += " (#" + id + ")" + `</span>
        </label>
      </div>`;
    }
  }


  upgradechainhtml += `   
            </div>
        </div>
        </div>

        <span style="margin-top: 20px;" class="submit-wrapper js-next left disabled">
          <span class="submit-hover trans-02s trans-opacity"></span>
          <input style="display: none;" id="upgradechainnext" onClick="upgradechainnextbut();" type="button" value="NEXT" class="trans-02s trans-color trans-background">
        </span>
      </div>

      <div style="padding-top: 0px;display: none;" id="upgradechain-step2" class="pane step2">

        <p>Please <span class="important">select</span> the upgrade which you want to apply on selected pledge:</p>
        <div class="js-custom-controls upgradechain-custom-controls">
          <input onchange="upgradechain_search_ccu_func();" id="upgradechain_search_ccu" class="js-custom-search upgradechain-custom-search" placeholder="Search upgrades"/>
        </div>
        <p id="showingall" class="warning" style="display: none;">ATTENTION! Showing all upgrades in hangar, because we can't find anything for this ship</p>
        <p id="ccu_noresults" style="display: none;">No results found</p>
          <div class="upgradeviewport" style="overflow-y: visible; height: 150px;">
            <div class="upgradecontent" style="top: 0px;">
              <div class="upgrade-ccu-rows">`;

  for (var i = 0, j = HangarXPLOR._inventory.length; i < j; i++) {

    if(HangarXPLOR._inventory[i].filters.is_upgrade) {

      var id = HangarXPLOR._inventory[i].pledge_id;
      var name = HangarXPLOR._inventory[i].displayName;
      var fullname = HangarXPLOR._inventory[i].pledge_name;

      name = replaceStrangeTxts(name);

      let t_ar = name.split("to");
      var ship_from = t_ar[0].trim();
      var ship_to = t_ar[1].trim();

      upgradechainhtml += `
      <div id="upgrade-ccurow-` + id + `" class="upgradechain-ccu-row row">
        <label onClick="upgradechain_selectccu(` + id + `);" for="upgradeccu-radio-` + id + `">
          <input id="upgradechain_ship_from_` + id + `" type=hidden value="` + ship_from + `"/>
          <input id="upgradechain_ship_to_` + id + `" type=hidden value="` + ship_to + `"/>
          <input id="upgradeccu-radio-`+ id + `" name="ccu_id" type="radio" value="` + id + `">
          <span id="upgradechain_ccu_span_` + id + `">` + fullname + " (#" + id + ")" + `</span>
        </label>
      </div>`;
    }

  }




 upgradechainhtml += `

            </div>
        </div>
        </div>

        <p>Type in your password to confirm:</p>
        <span class="corner-wrapper">
          <input onchange="upgradechainpasswordchanged();" type="password" id="upgradechain-password" value="" class="trans-02s trans-color trans-box-shadow">
          <span class="corner corner-top-left"></span>
          <span class="corner corner-top-right"></span>
          <span class="corner corner-bottom-left"></span>
          <span class="corner corner-bottom-right"></span>
        </span>

        
        <span class="submit-wrapper js-back back left active">
          <span class="submit-hover trans-02s trans-opacity"></span>
          <input id="upgradechainback" onClick="upgradechainbackbut();" type="button" value="BACK" class="trans-02s trans-color trans-background">
        </span>
        <span class="submit-wrapper js-submit right disabled">
          <span class="submit-hover trans-02s trans-opacity"></span>
          <input type="hidden" id="upgradechain_selected_pledge" value="">
          <input type="hidden" id="upgradechain_selected_ccu" value="">
          <input id="upgradechainapply" style="display: none;" onClick="upgradechainapplybut();" type="button" value="APPLY" class="trans-02s trans-color trans-background">
        </span>
     </div>

      
    </div></form>
  </div>
    <div class="separator"></div>
  </div>
</div>
      </div>
  <div class="bottom-border">
    <div class="h-border"></div>
    <div class="l-corner"></div>
    <div class="r-corner"></div>
        <img src="https://cdn.robertsspaceindustries.com/static/images/modal_blue_line.png">
      </div>
</div>
</div>
  `;


  document.getElementById("upgradechainblock").innerHTML = upgradechainhtml;

  document.getElementById('upgradechain_search_ship').addEventListener('keyup', e => {
      upgradechain_search_ship_func();
  });

  document.getElementById('upgradechain_search_ccu').addEventListener('keyup', e => {
      upgradechain_search_ccu_func();
  });
}