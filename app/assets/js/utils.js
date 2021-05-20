let Utils = {
    normalizeHeight: function(height) {
        //feet
        let arr = height.split("ft");
        let feet = arr[0] || "0";
        feet = feet.trim();
        //inch
        let inch_s = arr[1] || "0";
        inch_s = inch_s.split("in");
        let inch = inch_s[0] || "0";
        inch = inch.trim();
        feet = parseFloat(feet);
        inch = parseFloat(inch);
        //minus & padding
        if (inch < 0) {
            feet--;
            inch = inch + 12;
        }
        return feet + inch / 12;
    },
    floatToHeight: function(a) {
        let intPart = Math.floor(a);
        let decPart = ((a - intPart) * 12).toFixed();
        if (decPart == '0') return intPart + " ft ";
        else return intPart + " ft " + decPart + " in";
    },
    getParam: function(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
        return "";
    },
    getText: async function(url) {
        const response = await fetch(url);        
        let text = await response.text();
        return text;
    },
    getJson: async function(url) {
        const response = await fetch(url);   
        if(response.status == 200) {
            let json = await response.json();
            return json;
        } else {
            let error = await response.text();
            return {error: error};
        }     
    },
    postText: async function(url, param) {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(param) // body data type must match "Content-Type" header
        });        
        let text = await response.text();
        return text;
    },
    postJson: async function(url, param) {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(param) // body data type must match "Content-Type" header
        });
        if(response.status == 200) {
            let json = await response.json();
            return json;
        } else {
            let error = await response.text();
            return {error: error};
        }
    },
    toMoney: function(num) {
        return "$" + num;
    },
    toDate: function(date) {
        return moment(date).format("YYYY-MM-DD");
    },
    getAvatar(jsonString) {
        try {
            let avatarUrl = JSON.parse(jsonString);
            avatarUrl = avatarUrl[0].thumbnails?.large?.url??avatarUrl[0].url;
            return avatarUrl;
        } catch(e) {
            return "";
        }
    },
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    validateZip(zip) {
        var re = /^\d+$/;
        return re.test(zip);
    },
    copyToClipboard(text) {
        /* Get the text field */
        var copyText = document.createElement("input");
        copyText.setAttribute("type", "text");
        copyText.value = text;
        document.body.appendChild(copyText);

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
      
        /* Copy the text inside the text field */
        document.execCommand("copy");
        copyText.remove();
    },
    toast(text, duration = 3) {
        if(window.viewType && window.viewType == "projectDetail") {
            alert(text);
            return;
        }
        if($("div.toast").length == 0) {
            $("body").append($("<div></div>").addClass("toast"));
        }
        $("div.toast").text(text).addClass("shown");
        setTimeout(() => {
            $("div.toast").removeClass("shown");
        }, duration * 1000);
    }
}