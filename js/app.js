// APP
function parseXml(xml) {
    var dom = null;
    if (window.DOMParser) {
        try {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        }
        catch (e) { dom = null; }
    }
    else if (window.ActiveXObject) {
        try {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml)) // parse error ..

                window.alert(dom.parseError.reason + dom.parseError.srcText);
        }
        catch (e) { dom = null; }
    }
    else
        alert("cannot parse xml string!");
    return dom;
};

(function () {
    "use strict";

    var url = 'https://www.boardgamegeek.com/xmlapi2/collection?username=davicazu&version=1&subtype=boardgame';

    var canIcallApi = true;

    var obj = {};

    var callApi = function () {
        if (canIcallApi) {
            canIcallApi = false;
            $.get(url, function (xml) {
                var objStr = xml2json(xml,'');
                console.log('objStr',objStr);
                obj = JSON.parse(objStr);

                console.log('obj',obj);
            });

            setTimeout(function () {
                canIcallApi = true;
            }, 6000);

        }

    }
    callApi();


    (function(){
        var vm = {
            items: ko.observableArray()
        }

        ko.applyBindings(vm,document.getElementById('collection'));
    })();



})();