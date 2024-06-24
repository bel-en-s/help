import React, { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import Tabs from '../components/ui-kit/Tabs';
import MultumediaGrid from '../components/ui-kit/MultimediaGrid';
import Loading from '../components/Loading';
import Table from '../components/ui-kit/Table';
import Form from '../components/ui-kit/Form'
// import styles from '../styles/settings.module.css';

import { getScenes, deleteScene, updateScene, addScene } from '../utils/scenes';
import { getPopUps, deletePopUp, updatePopUp, addPopUp, deletePopUpFile } from '../utils/popups';
import { getUnits, addUnit, deleteUnit, updateUnit } from '../utils/units';
import { getTipologies, addTipology, tipologyHeaders, tipologyData, deleteTipology, updateTipology, uploadImage,deleteFile } from '../utils/tipologies';

export default function Settings(projectID, sidebarVisible) {
    const [scenes, setScenes] = React.useState([]);
    const [popUps, setPopUps] = React.useState([]);
    const [units, setUnits] = React.useState([]);
    const [tipologies, setTipologies] = React.useState([]);
    const [scenesLoaded, setScenesLoaded] = useState(false);
    const [popUpsLoaded, setPopUpsLoaded] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);


    useEffect(() => {
        getScenes((scenesData) => {
            setScenes(scenesData);
            setScenesLoaded(true);
            setDataLoaded(true);
        });

        getPopUps((popUpsData) => {
            const isLoaded = popUpsData !== null;
            setPopUps(popUpsData || []);
            setPopUpsLoaded(isLoaded);
            setDataLoaded(isLoaded);
        });

        getUnits((unitsData) => {
            setUnits(unitsData);
        });

        getTipologies((tipologiesData) => {
            setTipologies(tipologiesData);
        });

    }, []);

    const getTipologyDataForUnit = (unit) => {
        const tipology = tipologies.find(t => t.name === unit.tipology);
        return tipology ? tipologyData(tipology) : new Array(tipologyHeaders.length).fill('');
        console.log(units)
      };


    const tabs = [
        {
            label: 'Escenas',
            content: 
                <Table
                    title="Escenas"
                    headers={["ID", "Nombre", "Descripcion", "Estado"]}
                    data={scenes.map((scene) => [scene.id, scene.name, scene.description, scene.status])}
                    typesOfData={["text", "text", "text", ['Activa', 'Inactiva']]}
                    deleteRow={(sceneId) => deleteScene(sceneId)}
                    editRow={(scene) => updateScene(scene)}
                    addRow={(scene) => addScene(scene)}
                    showColumnSelector={true}
                    selectedTabLabel="Escenas"
                />
            
        },
        {
            label: 'Pop ups',
            content:
            <Table
                title="Pop ups"
                headers={["ID", "Titulo", "Descripcion","Footer", "Imagenes"]}
                data={popUps.map((popUp) => [popUp.id, popUp.title, popUp.description,popUp.footer, popUp.files])}
                typesOfData={["text", "text", "text","text", "image"]}
                addRow={(popUp) => { console.log(popUp); addPopUp(popUp) }}
                editRow={(popUp) => { console.log(popUp); }}
                deleteRow={(popUpId) => { console.log(popUpId); deletePopUp(popUpId) }}
                deleteFile={(popUpId) => { console.log(popUpId); deletePopUpFile(popUpId) }}
                showColumnSelector={false}
                selectedTabLabel="Pop ups"
            />,
        },
        {
            label: 'Grilla multimedia',
            content: <MultumediaGrid />,
        },
        {
            label: 'Lotes',
            content: [],
        },
        {
            label: 'Unidades',
            content: 
            <Table
                title="Unidades"
                headers={["ID","Unidad","Estado", "Piso","Tipologia",       ...tipologyHeaders ]}
                
                data={units.map((unit) => [
                unit.id,
                unit.unit,
                unit.state,
                unit.floor,
                unit.tipology,
                //COLOR OF TIPOGRAFY GREY
                ...getTipologyDataForUnit(unit)
                ])}
                typesOfData={["text", "text", "text", "text","text"]}
                addRow={(unit) => addUnit(unit)}
                editRow={(unit) => updateUnit(unit)}
                deleteRow={(unit) => deleteUnit(unit)}
                showColumnSelector={true}
                selectedTabLabel="Unidades"
            />
        },
        {
            label: 'Tipologias',
            content: 
            <Table
                title="Tipologias"
                headers={tipologyHeaders}
                data={tipologies.map(tipologyData)}
                typesOfData={[
                    "text","image", "text", "text", "text", "text", "text", "text", "text", "text", "text", 
                    "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", 
                ]}
                addRow={(tipology, file) => {
                    console.log(file); 
                    addTipology(tipology, file); 
                }}
                editRow={(tipology,file) => updateTipology(tipology,file)}
                deleteRow={(tipology) => deleteTipology(tipology)}
                showColumnSelector={true}
                deleteFile={(file) => deleteFile(file)}
            />
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
