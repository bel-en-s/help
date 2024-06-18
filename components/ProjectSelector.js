import { useState, useEffect } from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { getCookie, setCookie } from 'cookies-next';
import { getProjects } from '../utils/projects';
import styles from '../styles/ProjectSelector.module.css';

export default function ProjectSelector({ onSelectProject, props}) {
    const [projectID, setProjectID] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getProjects(setProjects);
        setProjectID(getCookie('projectID'));
    }, []);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (proj) => {
        setCookie('projectID', proj.id);
    };


    return (
        <div className={styles.projectSelector}>
            <div className={`${styles.projectSelectorHeader} ${isOpen ? '' : styles.closed}`} onClick={toggleAccordion}>
                <span className={styles.projectName}>
                <span className={styles.projectNameText}>
                    <span className={styles.projectTitle}>
                        {projects.find((proj) => proj.id === projectID)?.name}
                    </span>
                    {projects.find((proj) => proj.id === projectID)?.projectType && 
                        <span className={styles.projectType}>
                            {projects.find((proj) => proj.id === projectID).projectType}
                        </span>
                    }
                </span>
                </span>
                <FontAwesomeIcon icon={faAngleDown} className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
                <span >
                    <FontAwesomeIcon icon={faAngleDown} />
                </span>
            </div>
            <div className={`${styles.project} ${isOpen ? '' : styles.closed}`}>
                <ul className={`${styles.projectList} ${isOpen ? styles.open : ''}`}>
                     {projects.map((proj) => (
                        <Link href="/dashboard" className={styles.link}
                            onClick={() => {
                                setCookie('projectID', props.id);
                                onSelectProject(proj.id);
                            }}
                            key={proj.id}>
                            <li key={proj.id} onClick={() => handleItemClick(proj)}>
                            {proj.name || 'Untitled'}
                            </li>
                        </Link>
                    ))} 
                </ul>
            </div>
        </div>

    );
}