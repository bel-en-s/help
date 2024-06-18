import { useState, useEffect } from 'react';
import styles from '../../styles/ui-kit/Form.module.css';
import Preview from './Preview.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function Form({
    title,
    subtitle,
    labels,
    //headers,
    defaultValues,
    setDefaultValues,
    typesOfData,
    addRow,
    editRow,
    editMode,
    setEditMode,
    deleteFile,
    setSelectedPopUp,
    selectedTabLabel
}) {
    const [inputRefs, setInputRefs] = useState([]);
    const [file, setFile] = useState(null);
    const [inputValues, setInputValues] = useState({});
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const headers = ['Titulo', 'Descripcion','Footer','Estado' ];

    useEffect(() => {
        if (editMode) {
            setDefaultValues([]);
        }
    }, [editMode, setDefaultValues]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setPreviewImage(URL.createObjectURL(selectedFile));
    };

    useEffect(() => {
        if (defaultValues && Object.keys(defaultValues).length > 0) {
            setInputValues(defaultValues); 
        } else {
            setInputValues({});
        }
    }, [defaultValues]);

    const handleSubmit = () => {
        let newRow = {};
        console.log(file);
        newRow["ID"] = defaultValues[0];
        inputRefs.forEach((input, index) => {
            if (typesOfData[index] == "image") {
                newRow[headers[index]] = file;
            } else {
                newRow[headers[index]] = input.value;
            }
        });
        
        if (!editMode) {
            addRow(newRow);
        } else {
            console.log(newRow);
            editRow(newRow);
        }
    }

    function handleInputChange(e, indexOrHeader) {
        const { value } = e.target;
        if (typeof indexOrHeader === 'number') {
            const newDefaultValues = [...defaultValues];
            newDefaultValues[indexOrHeader] = value;
            setDefaultValues(newDefaultValues);
        } else {
            const newInputValues = { ...inputValues };
            newInputValues[indexOrHeader] = value;
            setInputValues(newInputValues);
        }
    }
    
    
    function setIsHidden() {
        const container = document.querySelector(`.${styles.container}`);
        container.classList.toggle(styles.hidden);
        setSelectedPopUp(null);
        if (selectedTabLabel !== "Pop ups") {
            container.classList.toggle(styles.hidden);
        }
    }

    const placeholders = {
        title: 'Título',
        description: 'Descripción',
        footer: 'Pie de página'
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                 {title}
                <FontAwesomeIcon
                    icon={faXmark}
                    className={styles.close}
                    onClick={() => {
                        setIsHidden(true);
                    }}
                />
            </h1>
            <h2 className={styles.subTitle}>{subtitle}</h2>
            <Preview></Preview>
            {previewImage && (
                    <img src={previewImage} alt="Preview" className={styles.previewImage} />
                )}
            {headers.map((header, index) => (
                <div key={index}>
                    <label htmlFor={`input-${index}`} className={styles.label}>
                        {labels && labels[header] ? labels[header] : placeholders[header] || header}
                    </label>
                    {typesOfData[index] == "text" ? (
                        <textarea
                            rows={2}
                            className={styles.input}
                            placeholder={header}
                            type="text"
                            ref={(el) => inputRefs[index] = el}
                            value={defaultValues[index]}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                    ) : null}
                    {typeof typesOfData[index] === 'object' ? (
                        <select
                            className={styles.select}
                            ref={(el) => (inputRefs[index] = el)}
                            value={inputValues[header]}
                            onChange={(e) => handleInputChange(e, header)}
                        >
                            {typesOfData[index].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : null}

                </div>
            ))}
            
            <div className={styles.row}>
            <div className={styles.submitButton}>
                    <label htmlFor="file-input" className={styles.fileInputLabel}>Elegir medios</label>
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </div>
                <div onClick={() => handleSubmit()} className={styles.submitButton}>
                   {editMode ? "Guardar cambios" : "Crear nuevo"}
                </div>
                <div onClick={() => {
                    console.log(defaultValues);
                    setEditMode(false);
                    defaultValues.forEach((value, index) => {
                        defaultValues[index] = null;
                    })
                    inputRefs.forEach((input) => {
                        if (input && input.value != "") {
                            input.value = "";
                        }
                    })
                    setFile(null);
                }} className={styles.submitButton}>
                    Restablecer
                </div>
            </div>
        </div>
    );
}
