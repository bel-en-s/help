import React from 'react';
import styles from '../../styles/Form.module.css';

export default function FormInput({ label, value, setValue, placeholder }) {
  return (
    <div className={styles.formInput}>
      <label htmlFor={label}>{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        type="text"
        id={label}
        name={label}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}