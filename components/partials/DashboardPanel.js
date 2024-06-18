import React, { useState, useEffect } from 'react';
import Chart from '../ui-kit/Chart';

import styles from '../../styles/ChartsPanel.module.css';
import getDashboardData from '../../utils/dashboard';
import Dropdown from '../ui-kit/Dropdown';
import Layout from '../../components/Layout';

export default function DashboardPanel() {
    const [dashboardData, setDashboardData] = useState({});
    const [selectedFilter, setSelectedFilter] = useState("30 dias");

    const handleTimeFrameChange = (index) => {
        setTimeFrameIndex(index);
    };

    useEffect(() =>{
        getDashboardData(setDashboardData, selectedFilter);
    }, [setDashboardData, selectedFilter])

    //loading
    const hasData = Object.keys(dashboardData).length > 0 && 
                    dashboardData.interactionsByDate && 
                    dashboardData.interacionsByExperience && 
                    dashboardData.usersByDate && 
                    dashboardData.usersByCountry;

    
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        console.log(dashboardData.dropRequests);
    };
    if (hasData) {
        return (
            <div className={styles.container}>
                    <Dropdown className={styles.accordionContainer} defaultOption="30 dias" options={["7 dias", "30 dias"]} onChange={handleFilterChange} label={"Filtrar por:"}/>                    <div className={styles.card}>
                        <span className={styles.cardNumber}>{dashboardData.interactionsByDate.quantity.reduce((a, b) => a + b, 0)}</span>
                        <span className={styles.cardText}>Interacciones</span>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.cardNumber}>{dashboardData.usersByDate.quantity.reduce((a, b) => a + b, 0)}</span>
                        <span className={styles.cardText}>Usuarios</span>
                    </div>
                        <Chart
                            title={"Interacciones"}
                            chartType="line"
                            inputData={dashboardData.interactionsByDate.quantity}
                            labels={dashboardData.interactionsByDate.labels}
                        />
                         <Chart
                            title={"Nuevos Usuarios"}
                            chartType="line"
                            inputData={dashboardData.usersByDate.quantity}
                            labels={dashboardData.usersByDate.labels}
                        />
                        <Chart
                            title={"Experiencias"}
                            chartType="bar"
                            inputData={dashboardData.interacionsByExperience.quantity}
                            labels={dashboardData.interacionsByExperience.labels}
                        />
                         <Chart
                            title={"Usuarios por país"}
                            chartType="bar"
                            inputData={dashboardData.usersByCountry.quantity}
                            labels={dashboardData.usersByCountry.labels}
                        />
                         <Chart
                            title={"Interacciones por OS"}
                            chartType="pie"
                            inputData={dashboardData.interactionsByOS.quantity}
                            labels={dashboardData.interactionsByOS.labels}
                        />
                         <Chart
                            title={"Usuarios por OS"}
                            chartType="pie"
                            inputData={dashboardData.uniqueUsersByOS.quantity}
                            labels={dashboardData.uniqueUsersByOS.labels}
                        />
                        <Chart
                            title={"Solicitudes de registro"}
                            chartType="line"
                            inputData={dashboardData.dropRequests.quantity}
                            labels={dashboardData.dropRequests.labels}
                        />
              </div>  
        );
    } else {
        return (
            <div className={styles.noDataMessage}>No project selected.</div>
        );
    }
}