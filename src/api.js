import xml2json from './xml2json';

const baseUrl = 'https://www.boardgamegeek.com';

let canIcallApi = true;

const getFromApi = function (urlApi, callback, onError) {
  if (canIcallApi) {
    canIcallApi = false;

    fetch(urlApi, {
        method: 'GET',
        mode: 'cors',
        "Content-Type": "application/xml",
      })
      .then(function (response) {
        return response.blob();
      })
      .then(function (miBlob) {
        let reader = new FileReader();

        reader.addEventListener("loadend", function () {

          const objStr = xml2json(reader.result, '');

          var obj = JSON.parse(objStr);
          //console.log('obj', obj);                
          callback.apply(null, [obj]);
        });
        reader.readAsText(miBlob);
      })
      .catch(() => {
        onError.apply(null, ['ERROR']);
      });

    setTimeout(function () {
      canIcallApi = true;
    }, 6000);
  }
};

let isFakeObj = false;

const API = {
  loadCollection: (callback, onError) => {
    if (isFakeObj) {
      if(window.fakeObj){
        callback.apply(null, [window.fakeObj]);
      }else{
        onError.apply(null, ['ERROR']);
      }      
    } else {
      const url = '/xmlapi2/collection?',
        parameters = 'username=davicazu&version=1&brief=1&subtype=boardgame';
      getFromApi(baseUrl + url + parameters, function (obj) {
        if (obj.items) {
          let idList = [];

          let objList = {};

          obj.items.item.forEach(function (item) {
            idList.push(item.objectid);
            objList[item.objectid] = item;
          });

          const idListStr = idList.join(',');

          const url2 = '/xmlapi2/thing?',
            parameters2 = 'id=' + idListStr + '&stats=1&type=boardgame';

          setTimeout(function () {
            canIcallApi = true;
            getFromApi(baseUrl + url2 + parameters2, function (obj) {

              obj.items.item.forEach(function (item) {
                item.myData = {};
                if (objList[item.id]) {
                  item.myData = objList[item.id];
                }
              });
              callback.apply(null, [obj]);
            });
          }, 5000);
        } else {
          onError.apply(null, ['Error']);
        }
      }, onError);
    }
  }
};

export default API;