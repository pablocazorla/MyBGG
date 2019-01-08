import React, { Component } from 'react';
import API from './api';
import BoxGame from './components/box-game';


const orderFunctions = {
  'Seleccionar':null,
  'A -> Z': (a,b) => {
    const aName = typeof a.name.length !== 'undefined' ? a.name[0].value : a.name.value;
    const bName = typeof b.name.length !== 'undefined' ? b.name[0].value : b.name.value;
    return aName <= bName ? -1 : 1;
  },
  'Z -> A': (a, b) => {
    const aName = typeof a.name.length !== 'undefined' ? a.name[0].value : a.name.value;
    const bName = typeof b.name.length !== 'undefined' ? b.name[0].value : b.name.value;
    return aName > bName ? -1 : 1;
  },
  'Ranking': (a, b) => {
    const aNum = parseFloat(a.statistics.ratings.average.value),
      bNum = parseFloat(b.statistics.ratings.average.value);
    return aNum > bNum ? -1 : 1;
  }
};

const orderFunctionsList = (function(){
  let list = [];
  for (var a in orderFunctions){
    list.push(a);
  }
  return list;
})();



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items:[],
      orderFunc:'Seleccionar',
      playerNumOptions: [],
      numPlayers:0,
      catList:[],
      catSelected:'0'
    };
    this.originalItems = [];
    this.setOrder = this.setOrder.bind(this);
    this.setNumPlayers = this.setNumPlayers.bind(this);
    this.setCat = this.setCat.bind(this);
  }
  componentDidMount () {
    this.setState({
      loading: true
    });

    const onLoad = obj => {
        
        this.originalItems = obj.items.item;
       
        let playerNumOptions = [],
          mpNum = 1;
        while (mpNum <= 10) {
          playerNumOptions.push(mpNum);
          mpNum++;
        }
        let catObj = {},
          catList = [];
        obj.items.item.forEach(function (elit) {
          elit.link.forEach(function (el) {
            if (el.type === 'boardgamemechanic'){
              catObj[el.value] = true;
            }
          });          
        });
        for (var a in catObj){
          catList.push(a);
        }

        this.setState({
          loading: false,
          items: obj.items.item,
          playerNumOptions,
          catList
        });

      },
      onError = () => {
        this.setState({
          loading: false
        });
      };

    API.loadCollection(onLoad,onError);
  }
  setOrder(e){
    let itemsTemp = this.originalItems.slice(0);

    const orf = orderFunctions[e.target.value];
    
    if (orf){
      itemsTemp.sort(orf);
    }    
    this.setState({
      items: itemsTemp,
      loading: true
    });
    let self = this;
    setTimeout(function(){
      self.setState({
        loading: false
      });
    },50);
  }
  setNumPlayers(e){
    this.setState({
      numPlayers: parseInt(e.target.value, 10),
      loading: true
    });
    let self = this;
    setTimeout(function () {
      self.setState({
        loading: false
      });
    }, 50);
  }
  setCat(e){
    this.setState({
      catSelected: e.target.value,
      loading: true
    });
    let self = this;
    setTimeout(function () {
      self.setState({
        loading: false
      });
    }, 50);
  }
  render() {
    const { loading, items, playerNumOptions, numPlayers, catList, catSelected} = this.state;
  
    return  <div className="collection">
      <div className="uk-container"> 
        <div className="bgg-header">
          <div className="bggh_box">
            <label>Ordenar por:</label>
            <div className="inp-box">
              <select className="uk-select uk-form-small"
                onChange={this.setOrder}
              >
                {orderFunctionsList.map((orf,k)=>{
                  return <option value={orf} key={k}>{orf}</option>;
                })}
              </select>
            </div>            
          </div>

          <div className="bggh_box">
            <label>Num. jugadores:</label>
            <div className="inp-box">
              <select className="uk-select uk-form-small"
                onChange={this.setNumPlayers}
              >
                <option value="0">Todos</option>
                {playerNumOptions.map((n,k)=>{
                  return <option value={n} key={k}>{n}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="bggh_box">
            <label>Mecánica:</label>
            <div className="inp-box">
              <select className="uk-select uk-form-small"
                onChange={this.setCat}
              >
                <option value="0">Todas</option>
                {catList.map((n, k) => {
                  return <option value={n} key={k}>{n}</option>;
                })}
              </select>
            </div>
          </div>

        </div>
      </div>
      <div className="uk-container">        
        {loading ? <div className="loading" data-bind="visible:loading">
          <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
        </div> : <div>
          {/* Header Tools */}
          <div className="bg-list">
          {items.map((item,k)=>{
            return <BoxGame data={item} key={k} catSelected={catSelected} numPlayers={numPlayers}/>;
            })}
          </div>
        </div>}
      </div>
    </div>;
  }
}

export default App;
