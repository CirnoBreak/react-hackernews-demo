import React, { Component } from 'react';
import Button from './Button';
// import logo from './logo.svg';
import './App.css';
import Table from './Table';
import Search from './Search';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: DEFAULT_QUERY,
      result: null
    }
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    console.log(this.state)
    this.setState({
      // result: Object.assign({}, this.state.result, { hits: updatedHits})
      result: { ...this.state.result, hits: updatedHits }
    });
    console.log(this.state)
  }
  
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    const oldHits = page !== 0 ? this.state.result.hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    // console.log(result)
    this.setState({
      result: {
        hits: updatedHits,
        page
      }
    });
    console.log(this.state)
  }

  fetchSearchTopStories(searchTerm, page=0) {
    console.log(page)
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit(e) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    e.preventDefault();
  }

  render() {
    const { searchTerm, result } = this.state,
      page = (result && result.page) || 0;
    // if (!result) { return null; }
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange.bind(this)}
            onSubmit={this.onSearchSubmit.bind(this)}
          >
            Search
        </Search>
        </div>{
          result &&
            <Table
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss.bind(this)}
            />
        }
        <div className="interactions">
          <Button onClick={this.fetchSearchTopStories.bind(this, searchTerm, page + 1)}>
            more
          </Button>
        </div>
        {/* {list.map((item) => {
          return (
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
            </div>
          )
        })} */}
      </div>
    );
  }
}

export default App;
