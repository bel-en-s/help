import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import styles from '../styles/Form.module.css';
import { addProject, editProject, getProjects } from '../utils/projects';
import FormInput from './ui-kit/FormInput';
import FormDateInput from './ui-kit/FormDateInput';
import FormSelectAccordion from './ui-kit/FormSelectAccordion';
//import FileUpload from './FileUpload';

export default function ProjectsForm({ 
    modalRef,
    data, 
    handleClose,
    projectData,
    label,
    setValue,
    placeholder }) 

{
    const { mode } = data;

    const [name, setName] = useState(data.name);
    const [client, setClient] = useState(data.client);
    const [description, setDescription] = useState(data.description);
    const [file, setFile] = useState(null);
    const [projectState, setProjectState] = useState(data.projectState || 'Online');
    const [projectType, setProjectType] = useState(data.projectType || '');
    const [day, setDay] = useState('');
    const [version, setVersion] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

   
    const formattedDate = `${year}-${month}-${day}`;

    useEffect(() => {
        if (mode === 'edit') {
            console.log(day);
            getProjects((projects) => {
                const project = projects.find((project) => project.id === data.id);
                if (project) {
                    const { name, client, description, projectState, projectType, day, month, year, version } = project;
                    setName(name || '');
                    console.log(name);
                    setClient(client || '');
                    setDescription(description || '');
                    setProjectState(projectState || 'Online');
                    setProjectType(projectType || 'hola');
                    setVersion(version || '');
                    console.log(day);
    
                    if (day && month && year) {
                        setDay(day);
                        setMonth(month);
                        setYear(year);
                    }
                }
            });
        }
    }, [mode, data.id]);
        const handleSave = () => {
        if (!name || !client || !day || !month || !year || !version) {
            toast.error('Por favor complete todos los campos', {
                style: {
                    zIndex: 9999,
                },
            });
        return; 
        }

        const projectData = {
            name: name,
            client: client,
            description: description,
            projectState: projectState,
            projectType: projectType,
            day: day,
            month: month,
            year: year,
            version: version,
            interactions: [],
            users: [],
            experiences: [],
            uniqueExperiences: []
        };


        if (mode === 'edit') {
            editProject(projectData);
        } else {
            addProject(projectData);
        }
            modalRef.current.closeModal();
        };

        return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <h1>{mode === 'edit' ? 'Editar proyecto' : 'Añadir proyecto'}</h1>
                </div>
                <div className={styles.closeButton} onClick={handleClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
            <div className={styles.formContainer}>
                <div className={styles.column}>
                    <FormInput
                    label="Nombre del proyecto"
                    placeholder="Nombre"
                    value={name}
                    setValue={setName}
                    />
                    <FormDateInput
                        label="Fecha de inicio:"
                        setDay={setDay}
                        setMonth={setMonth}
                        setYear={setYear}
                        placeholder="Dia"
                    />
                    <FormInput
                    label="Version actual:"
                    placeholder="0.0.0"
                    value={version}
                    setValue={setVersion}
                    />
                </div>
                <div className={styles.column}>
                    <FormSelectAccordion
                    label="Tipo de proyecto:"
                    placeholder="Seleccionar"
                    value={projectType}
                    setValue={setProjectType}
                    options={['XRS', 'Demo XR', 'Demo AR']}
                    />
                    <FormInput
                    label="Nombre del cliente:"
                    placeholder="Cliente"
                    value={client}
                    setValue={setClient}
                    />
                    <FormSelectAccordion
                    label="Estado:"
                    value={projectState}
                    setValue={setProjectState}
                    options={['Online', 'Offline']}
                    />
                </div>
            </div>
            {/* <FileUpload setFile={setFile} /> */}
                <button className={styles.formButton} onClick={handleSave}>
                    {mode === 'edit' ? 'Guardar cambios' : 'Crear proyecto'}
                </button>
        </div>
        );
    }
