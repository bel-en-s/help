import React from 'react';
import styles from '../../styles/ui-kit/Preview.module.css';


export default function Preview({ image }) {
  return (
    <div className={styles.previewContainer}>
      <img src={image} alt="Preview Image" />
    </div>
  );
}
