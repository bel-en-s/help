
import React from 'react';
import styles from '../../styles/Form.module.css';

export default function FormSelectAccordion({ label, value, setValue, options, placeholder }) {
  return (
    <div className={styles.formInput}>
      <label htmlFor={label}>{label}</label>
      <select
        value={value}
        className={styles.formSelect}
        name={label}
        id={label}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}