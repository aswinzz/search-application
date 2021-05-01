import React, { Component } from 'react';

export default class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };

  }

  getHighlightedString = (item, idx) => {
    const matchIndex = item.toLowerCase().indexOf(this.props.searchText.toLowerCase());
    const pre = item.substring(0, matchIndex);
    const highlight = item.substring(matchIndex, matchIndex + this.props.searchText.length);
    const rest = item.substring(matchIndex + this.props.searchText.length);
    return <li style={this.props.currentPosition === idx ? {backgroundColor: '#c1bebe', cursor: 'pointer'} : {cursor: 'pointer'}} onClick={() => {
      this.props.setSelectedItemIndex(idx)
    }}>
      {matchIndex !== -1 ? <>{pre}<font style={{color: 'red'}}>{highlight}</font>{rest}</> : item}
    </li>
  }

  render() {
    return (
        <div className='search-element'>
          <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center', marginRight: 80}}>
          <input onFocus={() => this.props.setListOpen(true)} className='search-input' value={this.props.searchText} onChange={this.props.onSearchTextChange} type="text" placeholder="Search.."/>
          {this.props.total > 0 ? <span className='total-count'>{this.props.total}</span> : null}
          </div>
          {this.props.total > 0 && this.props.isOpen ?
          <ul className='search-result'>
            {this.props.data.map((item,idx) => {
              return this.getHighlightedString(item, idx)
            })}
          </ul>
          : null}
        </div>
    );
  }
}
