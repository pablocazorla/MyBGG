// APP
(function () {
    "use strict";

    var round = function (value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    };

    var itemVM = function(data){
        
        var own = data.myData,
            itemOwn = data.myData.version ? data.myData.version.item : null;

        var ratings = data.statistics.ratings;

        var rank = (function(){
            var r = 0;
            if (ratings.ranks.rank.length){
                ratings.ranks.rank.forEach(function (it) {
                    if (it.name === 'boardgame') {
                        r = parseInt(it.value, 10);
                    }
                });
            }else{
                if (ratings.ranks.rank.name === 'boardgame') {
                    r = parseInt(ratings.ranks.rank.value, 10);
                }
            }
            
            return r;
        })();

        var langDependency = (function(){
            var ld = '';

            data.poll.forEach(function(p){
                if (p.name === 'language_dependence'){
                    
                    if (p.results && p.results.result){
                        var v = '', numvotes = 0;
                        p.results.result.forEach(function (re) {
                            var nv = parseInt(re.numvotes, 10);
                            if (nv > numvotes) {
                                numvotes = nv;
                                v = '(' + re.value + ')';
                            }
                        });
                        ld = v;
                    }                    
                }
            });

            return ld;
        })();

        var title = typeof data.name.length !== 'undefined' ? data.name[0].value : data.name.value,
            subtitle = own.name['#text'],
            isSubtitle = title !== subtitle;

        var lang = (function(){
            var l = ''
            if (itemOwn){
                itemOwn.link.forEach(function (it) {
                    if (it.type === 'language') {
                        l = it.value;
                    }
                });
            }            
            return l;
        })();

        var ds1 = new RegExp('&amp;','g'),
            ds2 = new RegExp('#10;', 'g'),
            ds3 = new RegExp('quot;', 'g');
        
        var vm = {
            title: isSubtitle ? subtitle : title,
            subtitle: isSubtitle ? title : subtitle,
            isSubtitle: isSubtitle,
            description: unescape(data.description || '')
                .replace(ds1, ' ')
                .replace(ds2, ' ')
                .replace(ds3, '"'),
            average: round(ratings.average.value,1),
            averageweight: 'width:' + (100 - 20 * ratings.averageweight.value) + '%',
            rank:rank,
            rankLink: 'https://boardgamegeek.com/browse/boardgame?sort=rank&rankobjecttype=subtype&rankobjectid=1&rank=' + rank + '#' + rank,
            link:'https://boardgamegeek.com/boardgame/'+data.id,
            styleImg: 'background-image: url("' + data.thumbnail +'")',
            lang: (lang === 'Spanish' ? 'Español' : lang),
            langDependency: (lang === 'Spanish' ? '' : langDependency),
            isLang: lang !== '',
            minplayers: data.minplayers.value,
            view_maxplayers: data.minplayers.value < data.maxplayers.value,
            maxplayers: data.maxplayers.value,

            playingtime: data.minplaytime.value !== data.playingtime.value ? data.minplaytime.value + '-' + data.playingtime.value : data.playingtime.value,
            minage: data.minage.value,

            yearpublished: data.yearpublished.value,

            details: [],
            detailsExpanded: ko.observable(false),
            descriptionExpanded: ko.observable(false),

        };

        vm.toggleDetails = function () {
            var d = vm.detailsExpanded();
            vm.detailsExpanded(!d);
        };
        vm.toggleDescription = function () {
            var d = vm.descriptionExpanded();
            vm.descriptionExpanded(!d);
        };

        var detailNames = {
            category: 'Categoría',
            mechanic: 'Mecánica',
            designer: 'Diseñador',
            artist: 'Artista',
            publisher: 'Publicado por',
            expansion: 'Expansión',
            family: 'Familia',
            compilation: 'Compilación',
            implementation: 'Implementación',
            integration: 'Integración'
        };

        var links = {}
        data.link.forEach(function (el) {
            var name = el.type.replace('boardgame', '');
            if (!links[name]) {
                links[name] = [];
            }
            links[name].push(el.value);
        });

        for (var a in links){
            vm.details.push({
                d_title: detailNames[a] ? detailNames[a] : a,
                d_text: links[a].join(', ')
            });
        }

        //console.log('vm.details', vm.details);

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

                //var nv = 24;
                //console.log('item '+nv,obj.items.item[nv]);//.myData.version.item);

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