import React from 'react';
import Button from './index';
import classNames from 'classnames';
const Sort = ({sortKey, activeSortKey, onSort, children}) => {
    const sortClass = classNames(
        'button-inline',
        {
            'button-active': sortKey === activeSortKey
        }
    );
    // if (sortKey === activeSortKey) {
    //     sortClass.push('button-active');
    // }
    return (
        <Button 
            onClick={() => onSort(sortKey)}
            className={sortClass}
        >
            {children}
        </Button>
    )
};
export default Sort;