import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Table from './Table';
import Search from './Search';
const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


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
    console.log(result)
    this.setState({ result });
    console.log(this.state)
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
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
    const { searchTerm, result } = this.state
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
