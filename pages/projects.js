import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import Modal from '../components/ui-kit/Modal';
import Layout from '../components/Layout';
import Card from '../components/Card';
import AddProjectCard from '../components/addProjectCard';
import ProjectsForm from '../components/ProjectsForm';
import Searchbar from '../components/ui-kit/Searchbar';
import topButtonsStyles from "../styles/ui-kit/TopButtons.module.css";

import { getProjects } from '../utils/projects';
import { getCookie, setCookie } from 'cookies-next';
import { authState } from '../utils/auth';
import styles from '../styles/Index.module.css';

export default function Index() {
    const [mode, setMode] = useState("create");
    const [projects, setProjects] = useState([]);
    const [projectID, setProjectID] = useState(null);


    const [inputValue, setInputValue] = useState("");
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [user, setUser] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        authState(setUser, "dashboard");
        getProjects(setProjects);
        setProjectID(getCookie("projectID"));
        getProjects((projectsData) => {
            setProjects(projectsData);
            setDataLoaded(true);
        });
    }, []);

    
    const handleItemClick = (proj) => {
        setCookie('projectID', proj.id);
    };

    let modalRef = React.createRef();
    const handleModalOpen = () => {
        modalRef.current.openModal()
    }

    useEffect(() => {
        const filtered = projects.filter(project =>
            project.name && typeof project.name === 'string' && project.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [inputValue, projects]);
    
    
    return (
        <>
            <Layout dataLoaded={dataLoaded}>
                <Modal ref={modalRef}>
                    <ProjectsForm modalRef={modalRef} data={{}} mode={mode} />
                </Modal>
                <h2>Proyectos disponibles</h2>
                <div className={topButtonsStyles.topButtonsContainer}>
                    <Searchbar
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                    />
                </div>
                <div className={styles.cardsContainer}>  
                {user && (user.role === 'superadmin' || user.role === 'admin') && user.views && user.views.includes('dashboard') && (
                        <div onClick={() => { handleModalOpen(); setMode('create'); }}>
                            <AddProjectCard/>
                        </div>
                    )}   
                   {filteredProjects.map((project) => {
                        return (
                            // <Link href="/dashboard" 
                            // className={styles.link} 
                            // key={project.id} onClick={() => { 
                            // setCookie('projectID', project.id);
                            // }}>
                                <div className={styles.cardContainer}>
                                    <div onClick={() => handleItemClick(project)}>
                                        <Card
                                            id={project.id}
                                            title={project.name}
                                            client={project.client}
                                            description={project.description}
                                            image={project.image}
                                            projectState={project.projectState}
                                            interactions={project.interactions}
                                            users={project.users}
                                            experiences={project.experiences}
                                            onSelectProject={handleItemClick}
                                        />
                                    </div>
                                </div>
                            // </Link>
                        );
                    })}
                </div>
            </Layout>
        </>
    );
}