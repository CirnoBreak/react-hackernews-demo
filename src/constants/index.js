import Button from '../components/Button';
import React from 'react';
import {sortBy} from 'lodash';

export const DEFAULT_QUERY = 'redux';
export const DEFAULT_HPP = '20';
export const PATH_BASE = 'https://hn.algolia.com/api/v1';
export const PATH_SEARCH = '/search';
export const PARAM_SEARCH = 'query=';
export const PARAM_PAGE = 'page=';
export const PARAM_HPP = 'hitsPerPage=';
const Loading = () => <div>Loading ...</div>;
const withLoading = (Component) => ({
    isLoading,
    ...rest
}) => isLoading
    ? <Loading/>
    : <Component { ...rest }/>;
export const ButtonWithLoading = withLoading(Button);
const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse()
};
const updateSearchTopStoriesState = (hits, page) => (prevState) => {
    const { searchKey, results } = prevState;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [
        ...oldHits,
        ...hits
    ];
    return {
        results: {
            ...results,
            [searchKey]: {
            hits: updatedHits,
            page
            }
        },
        isLoading: false
    }
}
export {
    SORTS,
    updateSearchTopStoriesState
}