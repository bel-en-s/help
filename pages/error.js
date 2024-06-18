import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Error.module.css';

export default function Error() {
    const router = useRouter();
  
    const handleBack = () => {
        router.back();
        router.back();
      };

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingText}>404</div>
      <div className={styles.subtitle}>
        Esta pagina no existe o no tienes persmisos para verla
      </div>
      <button className={styles.backButton} onClick={handleBack}>
        Volver
      </button>
    </div>
  );
}
