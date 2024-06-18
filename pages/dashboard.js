import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Tabs from '../components/ui-kit/Tabs';
import DashboardPanel from '../components/partials/DashboardPanel';
import Table from '../components/ui-kit/Table'
import { getUsers } from '../utils/users';
import { getExperiences } from '../utils/experiences';

export default function Dashboard({ sidebarVisible }) {
    const [users, setUsers] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); 

    useEffect(() => {
        getExperiences(setExperiences);
        getUsers((usersData) => {
            setUsers(usersData);
            setDataLoaded(true);
        });
    }, []);

    const tabs = [
        {
            label: 'Graficos',
            content: <DashboardPanel/>,
        },
        {
            label: 'Usuarios',
            content: <Table
                title="Usuarios"
                headers={['Nombre', 'Correo', 'Interacciones', 'Tiempo', 'Tiempo promedio']}
                data={users.map((user) => {
                    return [user.name, user.email, user.interactions.length, user.totalTime, user.averageTime];
                })}
                typesOfData={['text', 'text', 'text', 'text', 'text']}
            />,
        },
        {
            label: 'Experiencias',
            content: <Table
                title="Experiencias"
                headers={["Experiencia", "Interacciones", "Tiempo Total", "Tiempo promedio", "Usuarios únicos"]}
                data={experiences.map((experience) => {
                    return [experience.name, experience.count, experience.useTime, experience.averageTime, experience.uniqueUsers];
                })}
                typesOfData={["text", "text", "text"]}
            />,
        },
    ];

    console.log(sidebarVisible)

    return (
        <Layout dataLoaded={dataLoaded} sidebarVisible={sidebarVisible}>
                <div>
                    <Tabs tabs={tabs} sidebarVisible={sidebarVisible}/>
                </div>
        </Layout>
    );
}