import React, { useEffect } from 'react';
import styles from '../../styles/ui-kit/MultimediaGrid.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faCircleLeft, faCircleRight } from '@fortawesome/free-solid-svg-icons'
import ThreeDots from './ThreeDots'
import { addFile, getFiles, changePosition, deleteMediaFile } from '../../utils/multimediagrid';

export default function MultumediaGrid () {
    const fileInput = React.createRef();
    const [files, setFiles] = React.useState([]);

    getFiles(setFiles);

    const handleFileChange = (event) => {
        addFile(event.target.files[0])
        fileInput.current.value = null;
    }

    

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Medios subidos</h1>
            <h2 className={styles.subtitle}>Los medios subidos se reproducen en el HUB virtual de tu proyecto.</h2>
            <div className={styles.grid}>
                <div className={styles.gridItem} onClick={() => fileInput.current.click()}>
                    <div className={styles.media}>
                        <div className={styles.addFile}>
                            <input type="file" id="file" name="file" className={styles.inputFile} ref={fileInput} onChange={handleFileChange} accept="image/png, image/jpeg" />
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                    </div>
                </div>
                
                {files.map((file) => (
                    <div key={file.id} className={styles.gridItem}>
                        <div className={styles.media}>
                            <img src={file.file} alt="Media" />
                        </div>
                        <div className={styles.fileName}>
                            {file.fileName}
                        </div>
                        <div className={styles.actions}>
                            <FontAwesomeIcon icon={faCircleLeft} className={styles.icon} onClick={() => changePosition(file.id, "left", setFiles)} />
                            {/* <FontAwesomeIcon icon={faTrash} className={styles.icon} onClick={() => deleteMediaFile(file.id, file.fileName)} /> */}
                            <FontAwesomeIcon icon={faCircleRight} className={styles.icon} onClick={() => changePosition(file.id, "right", setFiles)} />
                            <ThreeDots fileId={file.id} deleteMediaFile={deleteMediaFile} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}