import React, { Component } from 'react';

const round = function (value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const setVisibleByNumPlayers = (data, numPlayers) => {
  if (numPlayers === 0){
    return true;
  }
  const min = parseInt(data.minplayers.value,10),
    max = parseInt(data.maxplayers.value, 10);

  return numPlayers >= min && numPlayers <= max;
};

const setVisibleByCat = (details, catSelected, visible) => {
  if (!visible){
    return false;
  }

  let v = true;
  if (catSelected !== '0'){
    v = false;
    details.forEach(function (de) {
      if (de.title === 'Mecánica') {
        let catList = de.text.split(',');

        catList.forEach(c => {
          if (c.indexOf(catSelected) >= 0 ) {            
            v = true;
          }
        });
        
      }
    });
  }
  
  return v;
};

export default class BoxGame extends Component {
  constructor(props) {
    super(props);

    

    const { data, numPlayers, catSelected} = this.props;

    const {myData} = data;
    const {ratings} = data.statistics;
    const itemOwn = data.myData.version ? data.myData.version.item : null;

    let m = {};

    m.link = 'https://boardgamegeek.com/boardgame/'+data.id;
    m.title = typeof data.name.length !== 'undefined' ? data.name[0].value : data.name.value;
    m.subtitle = myData.name['#text'];
    m.isSubtitle = m.title !== m.subtitle;

    const ds1 = new RegExp('&amp;','g'),
      ds2 = new RegExp('#10;', 'g'),
      ds3 = new RegExp('quot;', 'g');

    m.description =  unescape(data.description || '')
      .replace(ds1, ' ')
      .replace(ds2, ' ')
      .replace(ds3, '"');
    m.average = round(ratings.average.value,1);
    m.image = data.thumbnail;

    m.minplayers = data.minplayers.value;
    m.maxplayers = data.maxplayers.value;
    m.playingtime = data.minplaytime.value !== data.playingtime.value ? data.minplaytime.value + '-' + data.playingtime.value : data.playingtime.value;
    m.minage = data.minage.value;
    m.yearpublished = data.yearpublished.value;
    m.averageweight = 100 - 20 * ratings.averageweight.value;
    m.rank = (function(){
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
        return isNaN(r) ? 'None' : r;
    })();
    m.rankLink = m.rank !== 'None' ?'https://boardgamegeek.com/browse/boardgame?sort=rank&rankobjecttype=subtype&rankobjectid=1&rank=' + m.rank + '#' + m.rank:'';

    m.lang = (function(){
      var l = ''
        if (itemOwn){
            itemOwn.link.forEach(function (it) {
                if (it.type === 'language') {
                    l = it.value;
                }
            });
        }            
        return l === 'Spanish' ? 'Español' : l;
    })();
    m.langDependency = (function(){
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

      return m.lang === 'Español' ? '' : ld;
    })();

    m.details = (function(){
      var details = [];
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
      //console.log(data);
      var links = {}
      data.link.forEach(function (el) {
          var name = el.type.replace('boardgame', '');
          if (!links[name]) {
              links[name] = [];
          }
          links[name].push(el.value);
      });

      for (var a in links){
          details.push({
              title: detailNames[a] ? detailNames[a] : a,
              text: links[a].join(', ')
          });
      }
      return details;
    })();

    this.m = m;

    let visible = setVisibleByNumPlayers(data, numPlayers);

    visible = setVisibleByCat(m.details, catSelected, visible);
   

    this.state = {
      detailsExpanded: false,
      descriptionExpanded: false,
      visible
    };
    
  }
  // componentDidMount () {
  // }
  // componentWillUnmount () {
  // }
  // componentWillReceiveProps (nextProps) {
  // }
  render(){
    const {m} = this;

    const {detailsExpanded, descriptionExpanded,visible} = this.state;

    


    return visible ? <div className="bg-item"><div className="box-item">
    <div className="box-item-img" style={{
      'backgroundImage': 'url("' + m.image +'")'
    }}>
      <div className="average">{m.average}</div>
    </div>
    <div className="box-item-text">
      <a href={m.link} className="title" target="_blank" rel="noopener noreferrer">{m.isSubtitle ? m.subtitle : m.title}</a>
      {m.isSubtitle ? <div className="subtitle">{m.isSubtitle ? m.title : m.subtitle}</div>:null}
      <div className="cop">
        <div className="cop-cell">
          <i className="fa fa-users"></i>&nbsp;
          {m.minplayers}{m.minplayers < m.maxplayers ? <span>-{m.maxplayers}</span>:null}
        </div>
        <div className="cop-cell">
          <i className="fa fa-clock-o"></i>&nbsp;
          {m.playingtime} min.
        </div>
        <div className="cop-cell">
          <i className="fa fa-male"></i>&nbsp;
          {m.minage}+ años.
        </div>

        <div className="cop-cell">
          <i className="fa fa-calendar"></i>&nbsp;
          {m.yearpublished}
        </div>
        <div className="cop-cell">
          <div className="cop-diff">
            <div style={{
              'width': m.averageweight + '%'
            }}></div>
          </div>
        </div>
        <div className="cop-cell" data-bind="visible:isLang">
          ranking: <a href={m.rankLink} target="_blank" rel="noopener noreferrer">{m.rank}</a>
        </div>

      </div>
      <div className="cop">
        <div className="cop-cell" data-bind="visible:isLang">
          <i className="fa fa-language"></i>&nbsp;
          {m.lang}&nbsp;
          <span className="t-small">{m.langDependency}</span>
        </div>
      </div>

      <div className={'resume' + (descriptionExpanded ? ' descriptionExpanded':'')} >
        <div className="r-title" onClick={()=>{
        this.setState({
          descriptionExpanded: !this.state.descriptionExpanded,
          detailsExpanded: false
        });
      }}>Resumen <i className="fa fa-chevron-down"></i></div>
        <div className="r-description">{m.description}</div>
      </div>

        <div className={'resume' + (detailsExpanded ? ' descriptionExpanded' : '')} >
          <div className="r-title" onClick={() => {
            this.setState({
              detailsExpanded: !this.state.detailsExpanded,
              descriptionExpanded: false
            });
          }}>Detalles <i className="fa fa-chevron-down"></i>
          </div>
          <div className="r-description">
            {m.details.map((d, k) => {
              return <div className="details-item" key={k}>
                <div className="d-title">{d.title}</div>
                <div className="d-text">{d.text}</div>
              </div>;
            })}
          </div>
        </div>

    </div>
      
    </div></div> : null;
  }
}