import React from 'react';
import PropTypes from 'prop-types';
// function isSearched(searchTerm) {
//   return function (item) {
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }
const Search = ({value, onChange, onSubmit, children}) => {
        return (
            <form onSubmit={onSubmit}>
                {children} <input
                    type="text"
                    value={value}
                    onChange={onChange}
                />
                <button type="submit">
                    {children}
                </button>
            </form>
        );
    
}

Search.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    
}

export default Search;