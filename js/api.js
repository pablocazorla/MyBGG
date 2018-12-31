// API
(function () {
    "use strict";

    var url = 'https://www.boardgamegeek.com/xmlapi2/collection?username=davicazu&version=1&subtype=boardgame';

    var canIcallApi = true;

    window.API = {
        load: function (callback, onError) {
            if (canIcallApi) {
                canIcallApi = false;
                
                $.get(url, function (xml) {
                   // console.log(xml);
                    var objStr = xml2json(xml, '');
                    console.log('objStr',objStr);
                    var obj = JSON.parse(objStr);
                    callback.apply(null, [obj]);
                }).fail(onError);
                
                //callback.apply(null, [fakeObj]);

                setTimeout(function () {
                    canIcallApi = true;
                }, 6000);

            }
        }
    };
})();