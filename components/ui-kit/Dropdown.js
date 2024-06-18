import React, { useState } from 'react';
import styles from '../../styles/ui-kit/Accordion.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const Dropdown = ({ defaultOption, options, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultOption);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false); 
        if (onChange) {
            onChange(option)
        } 
    };

    return (
        <div className={styles.accordion}>
            <div className={styles.label}>{label}</div>
            <div className={styles.filterButton} onClick={toggleAccordion}>
                {selectedOption}
                <div className={styles.button}>
                    <FontAwesomeIcon icon={faAngleDown} />
                </div>
            </div>
            {isOpen && (
                <div className={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <div key={index} className={styles.option} onClick={() => handleOptionClick(option)}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
