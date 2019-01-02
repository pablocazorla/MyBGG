import React, { Component } from 'react';
import API from './api';
import BoxGame from './components/box-game';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items:[]
    }
  }
  componentDidMount () {
    this.setState({
      loading: true
    });

    const onLoad = obj => {
        this.setState({
          loading: false,
          items: obj.items.item
        });
      },
      onError = () => {
        this.setState({
          loading: false
        });
      };

    API.loadCollection(onLoad,onError);
  }
  render() {
    const {loading,items} = this.state;
    return  <div className="collection">
      <div className="uk-container">        
        {loading ? <div className="loading" data-bind="visible:loading">
          <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
        </div> : <div>
          {/* Header Tools */}
          <div className="bg-list">
          {items.map((item,k)=>{
              return <BoxGame data={item} key={k}/>;
            })}
          </div>
        </div>}
      </div>
    </div>;
  }
}

export default App;
