// API
(function () {
    "use strict";

    var baseUrl = 'https://www.boardgamegeek.com';

    var canIcallApi = true;

    var getFromApi = function (urlApi, callback, onError){
        if (canIcallApi) {
            canIcallApi = false;

            $.get(urlApi, function (xml) {
                var objStr = xml2json(xml, '');
                var obj = JSON.parse(objStr);
                //console.log('obj', obj);                
                callback.apply(null, [obj]);
            }).fail(onError);

            setTimeout(function () {
                canIcallApi = true;
            }, 6000);
        }
    }

    var isFakeObj = true;
    window.API = {
        load: function (callback, onError) {
            if (isFakeObj){                
                callback.apply(null, [fakeObj]);
            }else{
                var url = '/xmlapi2/collection?',
                    parameters = 'username=davicazu&version=1&brief=1&subtype=boardgame';
                getFromApi(baseUrl + url + parameters,function(obj){   
                    if(obj.items){
                        var idList = [];

                        var objList = {};

                        obj.items.item.forEach(function(item){                        
                            idList.push(item.objectid);
                            objList[item.objectid] = item;
                        });

                        var idListStr = idList.join(',');

                        var url = '/xmlapi2/thing?',
                            parameters = 'id=' + idListStr + '&stats=1&type=boardgame';

                        setTimeout(function () {
                            canIcallApi = true;
                            getFromApi(baseUrl + url + parameters, function (obj) {

                                obj.items.item.forEach(function (item) {
                                    item.myData = {};
                                    if (objList[item.id]){
                                        item.myData = objList[item.id];
                                    }
                                });

                                //console.log('wwwwwe', JSON.stringify(obj));

                            callback.apply(null, [obj]);
                            });
                        }, 5000);
                    }else{
                        onError.apply(null, ['Error']);
                    }                
                }, onError);
            }
        }
    };
})();