import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/ui-kit/ThreeDots.module.css';
import { deleteMediaFile } from '../../utils/multimediagrid';

export default function ThreeDotsMenu({ fileId, fileName }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleDelete = () => {
        deleteMediaFile(fileId, fileName);
        setIsOpen(false);
    };

    return (
        <div className={styles.threeDotsMenu} onClick={toggleMenu}>
            <FontAwesomeIcon icon={faEllipsisV} className={styles.icon} />
            {isOpen && (
                <div className={styles.dropdown} ref={dropdownRef}>
                    <ul>
                        <li onClick={handleDelete} className={styles.menuItem}>
                            <FontAwesomeIcon icon={faTrash} className={styles.iconMenu} />
                            <span>Eliminar</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
