import { useState, useEffect, useRef } from "react";
import Form from "./Form";
import Layout from "../Layout";
import Searchbar from "../ui-kit/Searchbar";
import TableColumnSelector from "../ui-kit/TableColumnSelector";
import styles from "../../styles/ui-kit/Table.module.css";
import topButtonsStyles from "../../styles/ui-kit/TopButtons.module.css";
import CsvDownloader from "./CsvDownloader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownAZ, faPencil, faTrash, faPlus, faLock } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "cookies-next";

export default function Table({
    title, headers, data, typesOfData,
    deleteRow, editRow,
    addRow, sidePanel,
    deleteFile, addTipology,
    showColumnSelector, selectedTabLabel
}) {
    const [inputValue, setInputValue] = useState('');
    const [body, setBody] = useState([]);
    const [rowEdit, setRowEdit] = useState(null);
    const [inputRefs, setInputRefs] = useState([]);
    const [newRowRefs, setNewRowRefs] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [columnsStatus, setColumnsStatus] = useState({});
    const [defaultValues, setDefaultValues] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedPopUp, setSelectedPopUp] = useState(null);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    useEffect(() => {
        setBody(data);
        const filtered = data?.filter(
            (row) => {
                return row?.some((cell) => cell.toString().toLowerCase().includes(inputValue.toLowerCase()));
            }
        );
        setBody(filtered);
        setInputRefs(new Array(headers.length));
        setNewRowRefs(new Array(headers.length));

        let defaultColumnsStatus = {};
        headers.forEach((header) => {
            defaultColumnsStatus[header] = true;
        });

        setColumnsStatus(defaultColumnsStatus);
    }, [data, inputValue]);

    const handleUpdate = async () => {
        const updatedRow = {};
        inputRefs.forEach((input, index) => {
            if (input) {
                updatedRow[headers[index]] = input.value;
            }
        });

        updatedRow[headers[0]] = rowEdit;

        editRow(updatedRow, files);
        setRowEdit(null);
        setFiles([]);
    }

    const handleAddRow = async () => {
        console.log('selectedFiles:', files);
        let newRow = {};
        newRowRefs.forEach((input, index) => {
            if (headers[index] === "Imagenes") {
                newRow[headers[index]] = files;
            } else {
                newRow[headers[index]] = input.value;
            }
        });

        addRow(newRow, files);
        setFiles([]);
        newRowRefs.forEach((input) => {
            input.value = '';
        });
    };

    const handleFileChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    }

    const handleDeleteFile = async (file) => {
        deleteFile(file);
    }
    
    const sortTable = (columnIndex) => {
        const sorted = [...body].sort((a, b) => {
            if (a[columnIndex] > b[columnIndex]) {
                return 1;
            }
            if (a[columnIndex] < b[columnIndex]) {
                return -1;
            }
            return 0;
        });
        setBody(sorted);
        setSelectedHeader(columnIndex);
    }

    return (
        <div className={styles.container}>
            <div>
                <div className={topButtonsStyles.topButtonsContainer}>
                    <FontAwesomeIcon
                        icon={faPlus}
                        className={styles.actionIcon}
                        onClick={() => {
                            setEditMode(false);
                        }}
                    />
                    <CsvDownloader
                        data={data}
                        columnsStatus={columnsStatus}
                        headers={headers}
                        filename={title}
                    />
               
                        <TableColumnSelector
                            headers={headers}
                            columnsStatus={columnsStatus}
                            setColumnsStatus={setColumnsStatus}
                            showColumnSelector={showColumnSelector}
                        />
                    
                    <Searchbar
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                    />
                </div>
                <div className={styles.container}>
                    <table>
                        <thead>
                            <tr>
                                {headers.map((header) => (
                                    columnsStatus[header] && header && (
                                        <th key={header}>
                                            <div className={styles.tableHeader}>
                                                {header}
                                                <FontAwesomeIcon
                                                    icon={faArrowDownAZ}
                                                    className={styles.icon + " " + (selectedHeader === headers.indexOf(header) ? styles.selected : '')}
                                                    onClick={() => sortTable(headers.indexOf(header))}
                                                />
                                            </div>
                                        </th>
                                    )))}
                            </tr>
                        </thead>
                        <tbody>
                            {body?.map((row) => (
                                <tr
                                    key={row[0]}
                                    className={styles.tableRow}
                                    onClick={() => {
                                        setEditMode(true);
                                    }}
                                >
                                    {row.map((cell, index) => (
                                        columnsStatus[headers[index]] && (
                                            <td key={`${row[0]}-${index}`}
                                                className={`${styles.tableCell} ${selectedTabLabel === "Unidades" && index >= 4 ? styles.greyText : ''}`}>
                                                {rowEdit === row[0] && index !== 0 && !sidePanel ? (
                                                    typesOfData[index] === "text" ? (
                                                        <input
                                                            type="text"
                                                            defaultValue={cell}
                                                            className={styles.input}
                                                            ref={(el) => inputRefs[index] = el}
                                                        />
                                                    ) : (
                                                        typesOfData[index] === "Image" ? (
                                                            <div className={styles.imageContainer}>
                                                                {cell && (
                                                                    <img
                                                                        src={cell}
                                                                        className={styles.image}
                                                                        alt="Preview"
                                                                    />
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    ref={(el) => inputRefs[index] = el}
                                                                    onChange={(e) => {
                                                                        console.log(e.target.files); // console log the file
                                                                        handleFileChange(e);
                                                                    }}
                                                                    className={styles.hiddenFileInput}
                                                                />
                                                                <button onClick={() => inputRefs[index].click()} className={styles.uploadButton}>
                                                                    Upload Images
                                                                </button>
                                                                <button onClick={() => handleDeleteFile(cell)} className={styles.deleteButton}>
                                                                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon> 
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            Array.isArray(typesOfData[index]) ? (
                                                                <select
                                                                    defaultValue={cell}
                                                                    className={styles.input + " " + styles.select}
                                                                    ref={(el) => inputRefs[index] = el}
                                                                >
                                                                    {typesOfData[index].map((option, optionIndex) => (
                                                                        <option key={optionIndex} value={option}>{option}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <option value="">Invalid Data</option>
                                                            )
                                                        )
                                                    )
                                                ) : (
                                                    
                                                    typesOfData[index] === "image" && cell ? (
                                                        <div className={styles.imageContainer}>
                                                            <img
                                                                src={cell}
                                                                className={styles.image}
                                                                alt="Preview!!"
                                                            />
                                                        </div>
                                                    ) : (
                                                        cell
                                                    )
                                                )}
                                            </td>
                                        )
                                    ))}
                                    <td className={`${styles.actionIcons} ${styles.tableCell}`}>
                                        <div className={styles.iconContainer}>
                                            {rowEdit === row[0] && !sidePanel ? (
                                                <FontAwesomeIcon
                                                    icon={faLock}
                                                    className={styles.actionIcon}
                                                    onClick={() => handleUpdate()}
                                                />
                                            ) : (
                                                editRow && (
                                                    <FontAwesomeIcon
                                                        icon={faPencil}
                                                        className={styles.actionIcon}
                                                        onClick={() => {
                                                            setRowEdit(row[0]);
                                                            setDefaultValues(row.slice(0, row.length));
                                                            setEditMode(false);
                                                        }}
                                                    />
                                                )
                                            )}

                                            {deleteRow && (
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className={styles.actionIcon}
                                                    onClick={() => deleteRow(row[0])}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {addRow && newRowRefs && !sidePanel && (
                                <tr className={styles.headers}>
                                    {headers.map((header, index) => (
                                        header && columnsStatus[header] && (
                                            <td key={header} className={styles.newRowCell}>
                                                {typesOfData[index] === "text" ? (
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        ref={(el) => newRowRefs[index] = el}
                                                        disabled={index === 0}
                                                    />
                                                ) : null}
                                                {Array.isArray(typesOfData[index]) ? (
                                                    <select
                                                        className={styles.input + " " + styles.select}
                                                        ref={(el) => newRowRefs[index] = el}
                                                        defaultValue={typesOfData[index][0]}
                                                    >
                                                        {typesOfData[index].map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : null}
                                                {typesOfData[index] === "image" && (
                                                    <input
                                                    //this
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        ref={(el) => newRowRefs[index] = el}
                                                        onChange={(e) => setFiles([...e.target.files])}
                                                        className={styles.hiddenFileInput}
                                                    />
                                                )}
                                            </td>
                                        )
                                    ))}
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className={styles.actionIcon}
                                            onClick={() => handleAddRow()}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
