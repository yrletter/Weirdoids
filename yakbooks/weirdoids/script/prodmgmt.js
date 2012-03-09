/**
 * 
 */

var $prodkeys = {};
var PRODKEY_PREFIX = 'local_user_prodkeys_';

function synchProdKeys() {

	// called at startup or when going online or after a purchase

	// read the keys from localstorage (if any)
	if ($local_user_id == 0) {
		// get the key
		if ($.cookies.test()) {
			$local_user_id = $.cookies.get('last_user_id');

			if ($local_user_id == null) {
				console.log("No last_user_id found");
				return;
			}

			else
				console.log("using retrieved userID: " + $local_user_id);
		}
	}

	local_user_prodkeys = eval('('
			+ localStorage.getItem(PRODKEY_PREFIX + $local_user_id) + ')');
	if (local_user_prodkeys != null) {
		console.log("Found the prodkeys for this user: "
				+ local_user_prodkeys.length);
	} else {
		console.log("No record of local_user_keys for " + $local_user_id);
	}

	// if online, get keys from server for current user
	// synch up. server is correct
	if ($online) {
		// call server
		$.ajax({
			url : '../yak/controllers/get_user_prodkeys.php',
			type : 'post',
			dataType : 'json',
			data : {
				user_id : $local_user_id
			},
			success : function(json) {
				// process the result
				if (json.errorcode == 0) {
					console.log("retrieved the user keys");
					$new_prodkeys = [];

					// synch up user data
					$.each(json.prodkeys, function(i, keyrec) {
						console.log("next prodkey " + keyrec.prodkey
								+ " name: " + keyrec.name);

						// if not in local keys, add it, make sure to store
						// later

						if (local_user_prodkeys[keyrec.prodkey] == null) {
							console.log("Key from server not in local keys!")
							// local_user_prodkeys.push(keyrec);
						}
						if ($prodkeys[keyrec.prodkey] == null) {
							console.log("Key from server not in $prodkeys!");
							$prodkeys[keyrec.prodkey] = keyrec.name;
						}
						$new_prodkeys[keyrec.prodkey] = keyrec.name;

					});
					
					// always overwrite local keys
					$prodkeys = $new_prodkeys;
					saveProdkeysLocal($local_user_id, $prodkeys);

				} else {
					serverAlert("Key Retrieval failure", json);
					console.log("Key Retrieval failure");
					console.log(json.errormsg);
				}
			},
			failure : function(data) {
				console.log("Key Retrieval failure");
			},
			complete : function(xhr, data) {
				if (xhr.status != 0 && xhr.status != 200)
					alert('Error calling server for Key Retrieval. Status='
							+ xhr.status + " " + xhr.statusText);
			}
		});
	} else {
		console.log("not online, so cant synch with server");
	}
}

function saveProdkeysLocal(userkey, prodkeys) {

	try {
		var saveKey = PRODKEY_PREFIX + userkey;
		console.log("saveProdkeysLocal: key = " + saveKey);

		localStorage.setItem(saveKey, JSON.stringify(prodkeys)); // store

	} catch (e) {
		alert("Error saving prodkeys to local storage: " + e.message);
		return false;
	}
	return true;

}

function beginPackPurchase(currentPack,userid)
{
	console.log("in beginPackPurchase for " + currentPack.heading1 + ' id = ' + currentPack.id);
	/*
    	"id": 1,
        "item_type": "pack",
        "pack_id": 1,
        "heading1": "Original Weirdoids",
        "heading2": "Free Starter Set",
        "cost_str": "Free!",
        "cost": "0.00",
        "listorder": 0,
        "special_img": "",
        "thumbnail": "imgs/pack1_thumbnail.png",
        "preview_small": "imgs/pack1_thumbnail.png",
        "preview_large": "imgs/pack1_thumbnail.png",
        "preview_text": "this is the preview_text_description",
        "packfile": "../imgs/p1_bands.txt"
            
	 */


	
	// populate header text

	$('#buy_now_page #pack_preview_small').html('<img src="' + currentPack.preview_small + '"></img>');
	$('#buy_now_page #pack_heading1').html(currentPack.heading1);
	$('#buy_now_page #pack_heading2').html(currentPack.heading2);
	$('#buy_now_page #pack_preview_text').html(currentPack.preview_text);
	$('#buy_now_page #pack_cost').html(currentPack.cost_str);
	$('#buy_now_page #pack_preview_large').html('<img src="' + currentPack.preview_large + '"></img>');
	
	createBuyButtons(currentPack,userid);
	
}

var payment_processors = [ "Google","Amazon","PayPal"];

function createBuyButtons(currentPack,userid)
{
	// on the beginpurchase page, populate the buttons for supported payment processors
	
	createGoogleBuyButton(currentPack,userid);
	
	
	$.mobile.changePage("#buy_now_page", {
		transition : "fade"
	});
	
}

function createGoogleBuyButton(currentPack,userid)
{
	/*
	 * 			<form
					action="https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/770630670709102"
					id="BB_BuyButtonForm" method="post" name="BB_BuyButtonForm"
					target="_top">
					<input name="item_name_1" type="hidden" value="Weirdoid Pack" /> 
					<input name="item_description_1" type="hidden" value="Monster Mash pack" />
					<input name="item_quantity_1" type="hidden" value="1" /> 
					<input name="item_price_1" type="hidden" value="1.99" /> 
					<input name="item_currency_1" type="hidden" value="USD" /> 
					<input name="shopping-cart.items.item-1.digital-content.description" type="hidden" value="these are instructions" /> 
					<input name="shopping-cart.items.item-1.digital-content.key" type="hidden" value="WGF0jlsYj9iFyCQ5TZHrmVBxecTMlRKLQjQa5T5W54w=" />
					<input name="shopping-cart.items.item-1.digital-content.key.is-encrypted" type="hidden" value="true" /> 
					<input name="shopping-cart.items.item-1.digital-content.url" type="hidden" value="http://weirdoids.com/fileaccessurl" /> 
					<input name="_charset_" type="hidden" value="utf-8" /> 
					<input alt="" src="https://sandbox.google.com/checkout/buttons/buy.gif?merchant_id=770630670709102&amp;w=117&amp;h=48&amp;style=trans&amp;variant=text&amp;loc=en_US" type="image" />
				</form>

	 */
	
	$('#BB_BuyButtonForm').submit(function() {
		  alert('You will be taken to Google Checkout. When you are done, restart Weirdoids to see new pack.');
		  
		  return true;
		});
	

	$('#BB_BuyButtonForm input[name="item_name_1"]').val(currentPack.heading1);
	$('#BB_BuyButtonForm input[name="item_description_1"]').val(currentPack.heading2);
	$('#BB_BuyButtonForm input[name="item_quantity_1"]').val(1);
	$('#BB_BuyButtonForm input[name="item_price_1"]').val(currentPack.cost);
	$('#BB_BuyButtonForm input[name="shopping-cart.items.item-1.merchant-item-id"]').val(currentPack.id);
	$('#BB_BuyButtonForm input[name="shopping-cart.merchant-private-data"]').val('<yakuserid>'+ userid + '</yakuserid>');
	$('#BB_BuyButtonForm input[name="shopping-cart.items.item-1.digital-content.description"]').val("item1 instructions");
	$('#BB_BuyButtonForm input[name="shopping-cart.items.item-1.digital-content.key"]').val("WGF0jlsYj9iFyCQ5TZHrmVBxecTMlRKLQjQa5T5W54w=");
	$('#BB_BuyButtonForm input[name="shopping-cart.items.item-1.digital-content.key.is-encrypted"]').val("true");
	$('#BB_BuyButtonForm input[name="shopping-cart.items.item-1.digital-content.url"]').val("http://weirdoids.com/fileaccessurl");
}
function userHasPurchased(packid) {
	
	// if $prodkeys exists, find pack
	return ($prodkeys && $prodkeys[packid] != null);
		
}