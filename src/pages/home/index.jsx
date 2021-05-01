import React, { Component } from 'react';
import { Layout } from 'antd';
import { debounce } from '../../util';

const { Header, Content, Footer } = Layout;

export default class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentPosition: -1,
      isOpen: false,
      total: 0
    };

    this.fetchData = debounce(this.fetchData.bind(this), 500);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyPress);
  }


  onKeyPress = (e) => {

    if (e.keyCode === 38) {
      console.log('UP');

      if (this.state.total > 0 && this.state.currentPosition - 1 > -1) {
        this.setState({currentPosition: this.state.currentPosition - 1});
      }
    }
    else if (e.keyCode === 40) {
      console.log('Down');

      if (this.state.total > 0 && this.state.currentPosition + 1 < this.state.total) {
        this.setState({currentPosition: this.state.currentPosition + 1});
      }
    }
    else if (e.keyCode === 13 && this.state.currentPosition > -1) {
      console.log('Enter');

      this.setState({selectedItemIndex: this.state.currentPosition, isOpen: false})
    }
  }

  fetchData = async () => {
    try {
      if (this.state.searchText) {
        const url = `https://swapi.dev/api/people/?search=${this.state.searchText}`;
        const res = await fetch(url);
        const response  = await res.json();
        if (response) {
          this.setState({
            total: response.count,
            data: response.results.map(item => item.name),
            isOpen: true
          })
        }
        
      }
    }
    catch(e) {
    }
  }

  onSearchTextChange = (e) => {
    if (!e.target.value) {
      this.setState({data: [], total: 0});
    }
    this.setState({searchText: e.target.value}, this.fetchData);
  }

  render() {
    return (
      <Layout style={{backgroundColor: '#F0F2F5'}} className="layout">
        <div class="topnav">
          <a class="active" href="">Home</a>
          <div className='search-element'>
          <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center', marginRight: 80}}>
          <input onFocus={() => this.setState({isOpen: true})} className='search-input' value={this.state.searchText} onChange={this.onSearchTextChange} type="text" placeholder="Search.."/>
          {this.state.total > 0 ? <span style={{marginTop: 10, marginLeft: -40}}>{this.state.total}</span> : null}
          </div>
          {this.state.total > 0 && this.state.isOpen ?
          <ul className='search-result'>
            {this.state.data.map((item,idx) => {
              const ind = item.toLowerCase().indexOf(this.state.searchText.toLowerCase());
              const pre = item.substring(0, ind);
              const highlight = item.substring(ind, ind + this.state.searchText.length);
              const rest = item.substring(ind + this.state.searchText.length);
              return <li style={this.state.currentPosition === idx ? {backgroundColor: '#c1bebe'} : {}} onClick={() => {
                this.setState({selectedItemIndex: idx, isOpen: false})
              }}>
                {ind !== -1 ? <>{pre}<font style={{color: 'red'}}>{highlight}</font>{rest}</> : item}
              </li>
            })}
          </ul>
          : null}
          </div>
        </div>

        {this.state.selectedItemIndex > -1 ?
        <Content style={{ left: 0,
          right: 0,textAlign: 'center', fontSize: 20, position: 'absolute', top: '50%' }}>
          <div>Selected Item is {this.state.data[this.state.selectedItemIndex]}</div>
        </Content> : null}
      </Layout>
    );
  }
}
