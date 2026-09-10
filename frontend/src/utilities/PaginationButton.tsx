import styles from '../css/homepage.module.scss';
import React from 'react';

export function handleChangePage (
    event: React.MouseEvent<HTMLButtonElement>, 
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
){
    const page = Number(event.currentTarget.value);
    if(currentPage == page) return
    window.scrollTo(0, 0);
    setCurrentPage(page)
}

export default function pageButtons(
    totalPage: number,
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) {
    let buttons = [];
    for(let i = 1; i <= totalPage; i++){
        const isFirst = i === 1;
        const isActive = i === currentPage;

        const classNames = [
            styles.pageButton,
            isFirst && styles.pageButtonFirst,
            isActive && styles.pageButtonActive
        ].filter(Boolean).join(' ')

        buttons.push(
            <button 
                key={i} 
                value={i} 
                className={classNames}
                onClick={ (event)=> handleChangePage(event, currentPage, setCurrentPage)}
            >
                {i}
            </button>
        )
    }
    return buttons
}