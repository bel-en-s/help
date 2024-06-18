import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/Card.module.css'

export default function AddProjectCard() {
    return (
        <div className={styles.cardNew}>
            <div className={styles.rowNew}>
                <h3> 
                    <FontAwesomeIcon className={styles.button} icon={faPlus} />
                    Añadir proyecto 
                </h3>
            </div>
        </div>
    )
}