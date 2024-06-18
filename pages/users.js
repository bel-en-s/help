import React, { useEffect, useState } from 'react'
import styles from '../styles/UsersPanel.module.css';
import Layout from '../components/Layout';
import Table from '../components/ui-kit/Table';
import Tabs from '../components/ui-kit/Tabs';

import { getPanelUsers } from '../utils/panelUsers';
import { authState, signUp } from '../utils/auth';
import { getCookie } from 'cookies-next';


export default function Users() {
    const [currentUser, setcurrentUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [projectID, setProjectID] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false); 

    useEffect(() => {
        authState(setcurrentUser, "users");
        getPanelUsers(setUsers);
        setProjectID(getCookie('projectID'));  
        getPanelUsers((usersData) => {
            setUsers(usersData);
            setDataLoaded(true);
        });
    }, []);

    
    const addRow = (user) => {
        let prompt = window.prompt("Ingrese la contraseña del usuario");

        if (prompt) { 
            console.log('hola')
            signUp({
                name: user.Nombre,
                email: user.Email,
                role: user.Rol,
                password: user.Password,
                project: projectID,
                userEmail: currentUser.email,
                userPassword: prompt
            });
        }
    }

    const tabs = [
        {
            label: 'Usuarios NW-panel',
            content: 
            <Table
            title="Usuarios"
            headers={["ID", "Nombre", "Email", "Rol", "Cliente", "Contraseña"]}
            data={users.map((user) => [user.id, user.name, user.email, user.role, user.client, user.password])}
            typesOfData={["text", "text", "text", ['admin', 'viewer','nomada'], "text", "text", "null"]}

            addRow={addRow}
        />   
        },
        {
            label: 'Proyectos',
            content: 
           []
        },
        {
            label: 'Grupos',
            content: 
           []
        },
    ];

    return (
        <Layout dataLoaded={dataLoaded}>
            <div>
                <Tabs tabs={tabs} />
            </div>
        </Layout>
    );
}
