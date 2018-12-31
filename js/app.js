// APP
(function () {
    "use strict";

    var itemVM = function(data){
        var vm = {
            title: data.name['#text'],
            image: data.thumbnail
        };

        return vm;
    };

   
    (function () {
        var vm = {
            items: ko.observableArray(),
            loading:ko.observable(false),
            errorApi:ko.observable(false),
        }

        vm.load = function(){
            vm.loading(true);
            API.load(function(obj){
                vm.loading(false);
                vm.errorApi(false);

                var itemList = [];
                obj.items.item.forEach(function(data){
                    var newItem = itemVM(data);
                    itemList.push(newItem);
                });

                vm.items(itemList);
            },function(errorApi){
                vm.loading(false);
                vm.errorApi(true);
            });
        }

        ko.applyBindings(vm, document.getElementById('collection'));

        vm.load();
    })();

})();