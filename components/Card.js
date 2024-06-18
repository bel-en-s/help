import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { deleteProject } from '../utils/projects';

import ProjectsForm from '../components/ProjectsForm';
import Modal from '../components/ui-kit/Modal';
import toast from 'react-hot-toast';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { setCookie } from 'cookies-next';
import { authState } from '../utils/auth';

import styles from '../styles/Card.module.css';

export default function Card({
    id,
    title,
    client,
    description,
    image,
    number,
    projectType,
    projectState,
    interactions,
    users,
    experiences,
    uniqueExperiences,
    onSelectProject,
}) 

{
    const modalRef = React.createRef();
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState('create');

    useEffect(() => {
        authState(setUser, "dashboard");
    }, [])

    const handleCardClick = () => {
       onSelectProject({ id });
        setCookie('projectID', id);
    };

    const totalInteractions = interactions.length;
    const totalUsers = users.length;
    const totalExperiences = experiences.length;
    
    let stateColor = '';
    if (projectState === 'Online') {
        stateColor = 'green';
    } else if (projectState === 'Offline') {
        stateColor = 'red';
    }

    const handleEdit = (event) => {
        modalRef.current.openModal();
        setMode('edit');
    };

    const handleDelete = (event) => {
        const confirmDelete = window.confirm("Seguro que quieres eliminar este proyecto??");
        if (confirmDelete) {
            deleteProject(id)
            
                    toast.success(`Proyecto "${title}" eliminado exitosamente`);
            
        }
    };


    return (
        <>
            <Modal ref={modalRef}>
                <ProjectsForm modalRef={modalRef} data={{
                    id: id,
                    name: title,
                    client: client,
                    description: description,
                    number: number,
                    interactions: interactions,
                    users: users,
                    experiences:experiences,
                    mode: mode
                }} />
            </Modal>
            <div className={styles.link}>
                <div className={styles.card}>
                    <div className={styles.row}>
                    <Link href="/dashboard" onClick={handleCardClick}>
                        <div className={styles.column}>
                            {image && (
                                <img src={image} alt="Card Image" className={styles.cardImage} />
                            )}
                        </div>
                        <div className={styles.column}>
                            <span className={styles.cardTitle}>
                                {title ? title : 'Untitled'}
                            </span>
                            <span className={styles.cardSubtitle}></span>
                            <span>{projectType}</span>
                            <span style={{ color: stateColor }}>⊙ {projectState}</span>
                            <div className={styles.row}>
                                <span className={styles.cardNumber}>
                               Interacciones: {totalInteractions}
                                </span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.cardNumber}>
                                  Experiencias: {totalExperiences}
                                </span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.cardNumber}>
                                Usuarios: {totalUsers}
                                </span>
                            </div>
                        </div>
                        </Link>
                        {user && (user.role === 'superadmin' || user.role === 'admin') && user.views && user.views.includes('dashboard') && (
                            <div className={styles.buttonContainer} >
                                <FontAwesomeIcon className={styles.button} icon={faPen} onClick={(event) => { handleEdit(); }}/>
                                {user && (user.role === 'superadmin' || user.role === 'admin') && user.views && user.views.includes('dashboard') && (
                                    <FontAwesomeIcon className={styles.button} icon={faTrash} onClick={() => { handleDelete(); }} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
