import React, { useState } from 'react';
import styles from '../../styles/ui-kit/TopButtons.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Searchbar({ inputValue, setInputValue }) {
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    
    return (
        <div className={styles.searchbarContainer}>
            <div className={styles.inputContainer}>
                <input
                    className={styles.inputFilter}
                    type="text"
                    value={inputValue}
                    placeholder="Buscar"
                    onChange={handleInputChange}
                />
            <FontAwesomeIcon icon={faSearch} className={styles.iconSearch} />
            </div>
        </div>
    );
}