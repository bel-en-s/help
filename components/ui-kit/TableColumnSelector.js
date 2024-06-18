import React from "react";
import styles from "../../styles/ui-kit/TopButtons.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList} from "@fortawesome/free-solid-svg-icons";

export default function TableColumnSelector({headers, columnsStatus, setColumnsStatus}) {
    let columnSelector = React.useRef(null);
    if (columnSelector.current){
        columnSelector.current.style.display = "none";
    }

    return (
        <div>
            <div
                className={styles.columnSelectorButton}
                onClick={() => {
                    columnSelector.current.style.display = columnSelector.current.style.display == "none" ? "block" : "none";
                }}
            >
                <FontAwesomeIcon icon={faList} className={styles.columnSelectorIcon} />
            </div>

            <div ref={columnSelector} className={styles.columnOptions}>
                {headers.map((header) => (
                    <div
                        key={header}
                        className={styles.columnSelectorOption}
                        onClick={() => {
                            setColumnsStatus({
                                ...columnsStatus,
                                [header]: !columnsStatus[header]
                            })
                        }}
                    >
                        <input
                            className={styles.columnSelectorCheckbox}
                            type="checkbox"
                            checked={columnsStatus[header]}
                        />
                        {header}
                    </div>
                ))}
            </div>
        </div>
    );
}