import React from "react";
import { CSVLink } from "react-csv";
import CsvStyle from '../../styles/ui-kit/TopButtons.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const CsvDownloader = ({ data, filename, columnsStatus }) => {
    let status = Object.values(columnsStatus);
    let downloadData = [];
    data.forEach(element => {
        let row = [];
        element.forEach((cell, index) => {
            if (status[index] == true) {
                row.push(cell);
            }
        });
        downloadData.push(row);
    });

    let columns = Object.keys(columnsStatus);
    let headers = columns.filter((column, index) => status[index] == true);

    return (
        <CSVLink data={downloadData} filename={filename} className={CsvStyle.csvLink} headers={headers}>
            <FontAwesomeIcon icon={faDownload} className={CsvStyle.icon} />
        </CSVLink>
    );
};

export default CsvDownloader;
