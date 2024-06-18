import React, { useEffect } from 'react';
import styles from '../../styles/Form.module.css';

export default function FormDateInput({ label, day, month, year, setDay, setMonth, setYear }) {

    return (
        <div className={styles.dateInputContainer}>
            <label>{label}</label>
            <div className={styles.input}>
                <input type="text" placeholder="Dia" value={day} onChange={(e) => setDay(e.target.value)} />
                <input type="text" placeholder="Mes" value={month} onChange={(e) => setMonth(e.target.value)} />
                <input type="text" placeholder="Año" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
        </div>
    );
}
