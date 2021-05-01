import React, { Component } from 'react';
import { Layout } from 'antd';
import { debounce } from '../../util';
import Search from '../../components/search';

const { Content } = Layout;

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
      if (this.state.total > 0 && this.state.currentPosition - 1 > -1) {
        this.setState({currentPosition: this.state.currentPosition - 1});
      }
    }
    else if (e.keyCode === 40) {
      if (this.state.total > 0 && this.state.currentPosition + 1 < this.state.total) {
        this.setState({currentPosition: this.state.currentPosition + 1});
      }
    }
    else if (e.keyCode === 13 && this.state.currentPosition > -1) {
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

  setListOpen = (isOpen) => {
    this.setState({isOpen})
  }

  setSelectedItemIndex = (idx) => {
    this.setState({selectedItemIndex: idx, isOpen: false})
  }

  render() {
    return (
      <Layout className="layout">
        <div class="topnav">
          <a class="active" href="">Home</a>
          <Search data={this.state.data} setSelectedItemIndex={this.setSelectedItemIndex} selectedItemIndex={this.state.selectedItemIndex} total={this.state.total} currentPosition={this.state.currentPosition} isOpen={this.state.isOpen}  setListOpen={this.setListOpen} searchText={this.state.searchText} onSearchTextChange={this.onSearchTextChange}/>
        </div>

        {this.state.selectedItemIndex > -1 ?
        <Content className='content'>
          <div>Selected Item is {this.state.data[this.state.selectedItemIndex]}</div>
        </Content> : null}
      </Layout>
    );
  }
}
