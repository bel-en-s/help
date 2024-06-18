import { useState, useEffect } from "react";
import Link from 'next/link';
import ProjectSelector from '../ProjectSelector';
import { authState } from "../../utils/auth"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faHome,
    faVrCardboard,
    faChartArea,
    faPlay,
    faBars,
    faWrench,
    faPencil,
    faUserGroup,
    faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { logOut } from "../../utils/auth"
import styles from '../../styles/ui-kit/Sidebar.module.css';

export default function Sidebar({ updateSidebarVisibility, views }) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [project, setProject] = useState(null);
    const [user, setUser] = useState(null)

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
        updateSidebarVisibility(!sidebarVisible);
    };

    const handleSelectProject = (selectedProject) => {
        setProject(selectedProject);
    };

    useEffect(() => {
        let parsedRoute = window.location.pathname.split("/")
        authState(setUser, parsedRoute[1])
    }, [])

    let viewsList = []
    if (views) {
        let viewsArray = Object.keys(views)
        viewsArray.forEach((view) => {
            viewsList.push(views[view])
        })
    }

    return (
        <div className={`${styles.sidebar} ${!sidebarVisible ? styles.hidden : ''}`}>
            <div className={styles.logoContainer}>
                <img
                    href="/"
                    src="/img/logo.png"
                    alt="logo"
                    className={styles.logo}
                />
                <FontAwesomeIcon icon={faBars} className={styles.hamburgerIcon} onClick={toggleSidebar} />
            </div>
            <div className={styles.project}>
                <ProjectSelector onSelectProject={handleSelectProject} />
            </div>
            <div className={styles.sidebarItemWrapper}>
                <SidebarItem icon={faHome} text="Inicio" link="/" viewsList={viewsList} />
                <SidebarItem icon={faUser} text="Perfil" link='/profile' viewsList={viewsList} />
                <SidebarItem icon={faUserGroup} text="Usuarios" link='/users' viewsList={viewsList} />
                <SidebarItem icon={faChartArea} text="Dashboard" link="/dashboard" viewsList={viewsList} />
                <SidebarItem icon={faPencil} text="Administrador" link="/settings" viewsList={viewsList} />
                <SidebarItem icon={faUserGroup} text="Administrador Panel" link='/users' viewsList={viewsList} />
               
               
                <div className={styles.userContainer}>
                <div className={styles.textColumn}>
                    <h2>Logged as:</h2>
                    <h4>{user?.email}</h4>
                    <h4>{user?.role}</h4>
                </div>
                <div className={styles.iconColumn}>
                    <div className={styles.logoutIcon}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} onClick={() => logOut()} />
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon, text, link, viewsList }) {
    if (viewsList && viewsList.includes(text.toLowerCase())) {
        // console.log('viewsList ' + viewsList)
        return (
            <Link href={link} className={styles.sidebarItem}>
                <div className={styles.sidebarItemIcon}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span>{text}</span>
            </Link>
        )
    }
}