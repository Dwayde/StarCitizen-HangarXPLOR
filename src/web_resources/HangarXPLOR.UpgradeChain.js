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