import React, {Component} from 'react';

// import logo from './logo.svg';
import './index.css';
import Table from '../Table';
// import Button from '../Button';
import Search from '../Search';
import {updateSearchTopStoriesState} from '../../constants';
import {
    DEFAULT_QUERY,
    DEFAULT_HPP,
    PATH_BASE,
    PATH_SEARCH,
    PARAM_SEARCH,
    PARAM_PAGE,
    PARAM_HPP,
    ButtonWithLoading
} from '../../constants';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: DEFAULT_QUERY,
            results: null,
            searchKey: '',
            error: null,
            isLoading: false
        }
    }

    onDismiss(id) {
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];
        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
        console.log(this.state)
        this.setState({
            // result: Object.assign({}, this.state.result, { hits: updatedHits})
            results: {
                ...results,
                [searchKey]: {
                    hits: updatedHits,
                    page
                }
            }
        });
        console.log(this.state)
    }
    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    setSearchTopStories(result) {
        const {hits, page} = result;

        // console.log(result)
        this.setState(updateSearchTopStoriesState(hits, page));
        console.log(this.state)
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        console.log(page)
        this.setState({isLoading: true});
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(response => response.json())
        .then(result => {
            this.setSearchTopStories(result)
        })
        .catch(e => this.setState({error: e}));
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm})
        this.fetchSearchTopStories(searchTerm);
        window.addEventListener('scroll', this.onScroll.bind(this), false);
    }

    onSearchSubmit(e) {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm})
        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
        e.preventDefault();
    }


    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll.bind(this), false);
    }

    onScroll() {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight)) {
            const { searchKey, results, isLoading } = this.state,
            page = (results && results[searchKey] && results[searchKey].page) || 0
            if (!isLoading) {
                this.fetchSearchTopStories(searchKey, page + 1)
                console.log(`page: ${page}`)
            }
        }
    }

    render() {
        const {searchTerm, results, searchKey, error, isLoading} = this.state,
            page = (results && results[searchKey] && results[searchKey].page) || 0,
            list = (results && results[searchKey] && results[searchKey].hits) || [];
        // if (!result) { return null; }
        if (error) {
            return <p>Something went wrong.</p>
        }
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this
                        .onSearchChange
                        .bind(this)}
                        onSubmit={this
                        .onSearchSubmit
                        .bind(this)}>
                        Search
                    </Search>
                </div>
                {error
                    ? <div className="interactions">
                            <p>Something went wrong.</p>
                        </div>
                    : <Table
                        list={list}
                        onDismiss={this
                        .onDismiss
                        .bind(this)}/>
}
                <div className="interactions">
                    {/* { isLoading
          ? <Loading />
          :
          <Button onClick={this.fetchSearchTopStories.bind(this, searchTerm, page + 1)}>
            more
          </Button>
        } */}
                    <ButtonWithLoading
                        isLoading={isLoading}
                        onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                        More
                    </ButtonWithLoading>
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
