var hardcoded = true;
var UKname = "Full Name"; 
var UKemail = "email@email.com";
var UKtel = "07777777777";
var UKaddr1 = "Flat 1";
var UKaddr2 = "Block 1";
var UKaddr3 = "Street";
var UKcity = "City";
var UKzip = "POST CDE";
var UKcountry = "GB";
var UKcardtype = "visa";
var UKcardnumb = "1234123412341234";
var UKexpmonth = "10";
var UKexpyear = "2017";
var UKcnv = "123";
// Retrieves g-recaptcha token from file.
function getToken() {
	console.log("Get token");
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL('g-recaptcha-response.txt'), false);
	xhr.onreadystatechange = function()
	{
	    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
	    {
	        //... The content has been read in xhr.responseText
	        token = (xhr.responseText);
	    }
	};
	xhr.send();
	console.log("    + Obtained re-captcha token");
}

// Go to checkout page.
function goToCart() {
	window.open('https://www.supremenewyork.com/checkout', '_blank').focus();
	console.log("    + Opened checkout page");
	console.log("---------------------------------------------------------");
	console.log("---THIS CONSOLE MAY NOT SHOW ACTIVITY ON CHECKOUT PAGE---");
	console.log("---------------------------------------------------------");
	clearInterval(checkInCart);
	clearInterval(setSize);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

// Retrieves user data and starts script.
function onGot(item) {
	console.log("Getting user details.")
	UKname 		=	item.order_billing_name;
	console.log("    + Name = " + item.order_billing_name);
	UKemail 	=	item.order_email;
	UKtel 		=	item.order_tel;
	UKaddr1		=	item.bo;
	UKaddr2		=	item.oba3;
	UKaddr3		=	item.order_billing_address_3;
	UKcity 		=	item.order_billing_city;
	UKpostcode 	= 	item.order_billing_zip;
	UKcountry 	= 	item.order_billing_country;
	UKcardtype 	=	item.credit_card_type;
	UKcardnumb 	= 	item.cnb;
	UKcnv 		= 	item.vval;
	UKexpmonth 	= 	item.credit_card_month;
	UKexpyear 	= 	item.credit_card_year;
	desiredSize = 	item.size;
	mode		=	item.mode;
	man_token	=	item.man_token;
	if (man_token == "true") {
		console.log("[OPT]: Using manual captcha token.");
		token =	item.recaptcha;	
	}
	console.log("    + Obtained user details")
	if (!man_token) { getToken(); }

	var pathname 		= window.location.pathname;
	var pathname_first 	= pathname.substring(0,5);
	var pathname_second = pathname.substring(0,9);

	if (pathname != "/checkout" && pathname.length > 25) {	// If we are on product page.
		console.log("[STATUS]: On product page.")
		console.log("Attemping to set size to " + desiredSize);
		var add_to_cart = setInterval( function() {
			if (document.getElementById("cart-remove")) {
				console.log("    +  ADDED TO CART");
				console.log("Attempting to visit checkout page...");
				clearInterval(add_to_cart);
				goToCart();
			}
			console.log("Start interval");
			var sizeList = document.getElementById("size");
			var currentSize = sizeList.options[sizeList.selectedIndex].textContent;
			var currentSizeId = sizeList.options[sizeList.selectedIndex].value;
			console.log("Current Size = " + currentSize);
			if (currentSize != desiredSize) {
				sizeList.value = parseInt(currentSizeId) + 1;
			}
			if (currentSize == desiredSize) {
				console.log("Attempting to ADD-TO-CART.")
				document.getElementsByTagName('input')[2].click();
				console.log("Clicked ADD-TO-CART");
			}
		}, 1000);

	}
	else if (pathname == "/checkout") {
		console.log("[STATUS]: On checkout page");
		if (mode == 0 || mode == 1) {
			console.log("Attempting to remove google captcha.");
			document.getElementById("g-recaptcha-response").remove();
			console.log("    + Google captcha removed.");
			console.log("Injecting google re-captcha response.");
			var response = document.createElement("input");
			response.setAttribute("type", "hidden");
			response.setAttribute("name", "g-recaptcha-response");
			response.setAttribute("value", token);
			document.getElementById("checkout_form").appendChild(response);
			console.log("    + Injected google re-captcha response.");
		}
		console.log("Filling out details.");
		fillForm();
		if (mode == 0) {
			console.log("   ___ _  _ ___ ___ _  _____  _   _ _____   _  _  _____      __");
			console.log("  / __| || | __/ __| |/ / _ \\| | | |_   _| | \\| |/ _ \\ \\    / /");
			console.log(" | (__| __ | _| (__| ' < (_) | |_| | | |   | .` | (_) \\ \\/\\/ / ");
			console.log("  \\___|_||_|___\\___|_|\\_\\___/ \___/  |_|   |_|\\_|\\___/ \\_/\\_/");
		} else {
			console.log("----------------------------------------------");
			console.log("---Selected Mode only takes us to checkout.---");
			console.log("----------------------------------------------");
		}
	}
	else {
		console.log("[STATUS]: On page " + pathname);
		console.log("         Â¬No work to do.");
	}

}

var getting = browser.storage.local.get(
	[
	"order_billing_name",
	"order_email",
	"order_tel",
	"bo",
	"oba3",
	"order_billing_address_3",
	"order_billing_city",
	"order_billing_zip",
	"order_billing_country",
	"credit_card_type",
	"cnb",
	"credit_card_month",
	"credit_card_year",
	"vval",
	"size",
	"mode",
	"man_token"
	]
);
getting.then(onGot, onError);

console.log("test");

var check_page = setInterval( function(){
	if (document.getElementById("size")) {
		getting.then(onGot, onError);
		clearInterval(check_page);
	}
}, 250);


// Fill out form and replace captcha response.
function fillForm() {
	document.getElementById("order_billing_name").value = UKname; 
	document.getElementById("order_email").value = UKemail;
	document.getElementById("order_tel").value = UKtel;
	document.getElementById("bo").value = UKaddr1;
	document.getElementById("oba3").value = UKaddr2;
	document.getElementById("order_billing_address_3").value = UKaddr3;
	document.getElementById("order_billing_city").value = UKcity;
	document.getElementById("order_billing_zip").value = UKpostcode; 
	document.getElementById("order_billing_country").value = UKcountry;
	console.log("    + Filled out billing details");

	document.getElementById("credit_card_type").value = UKcardtype; 
	document.getElementById("cnb").value = UKcardnumb; 
	document.getElementById("vval").value = UKcnv;
	document.getElementById("credit_card_month").value = UKexpmonth;
	document.getElementById("credit_card_year").value = UKexpyear;
	console.log("    + Filled out credit card details");

	document.getElementById("order_terms").checked = true;
	console.log("    + Terms Accepted");
}

// Click "process payment"
function processPayment() {
	console.log("Processing payment");
	var processPayment = document.getElementById("checkout_form");
	var date 	= new Date();
	var seconds = date.getSeconds();
	// If we are buying on drop day.
	if (mode == 0) {
		// Dont checkout unless item released for more than 3 seconds.
		if (seconds > 3) {
			setInterval( function() {
				processPayment.submit();
			}, 500);
		}
	// If we are in restock mode, checkout instantly.
	} else {
		console.log("Restock mode has been patched.")	
	}
}

