import React from 'react'
import styles from "../styles/Loading.module.css"

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingContent}>
                <div className={styles.loader}></div>
                {/* <div className={styles.loadingText}>Cargando...</div>
                <div className={styles.subtitle}>Estamos preparando tus herramientas de trabajo.</div> */}
            </div>
        </div>
    );
}