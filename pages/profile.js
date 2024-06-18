import React, { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import Styles from '../styles/Profile.module.css';
import toast from 'react-hot-toast';

import { getProfileData, updateProfileData } from '../utils/profile';
import { updatePasswordUser } from '../utils/auth';

export default function profile() {
    const [data, setData] = React.useState({});
    const [dataLoaded, setDataLoaded] = useState(false);
    
    let nameRef = React.createRef();
    let lastNameRef = React.createRef();
    let emailRef = React.createRef();

    let currentPasswordRef = React.createRef();
    let newPasswordRef = React.createRef();
    let confirmPasswordRef = React.createRef();
  
    getProfileData((profileData) => {
        setData(profileData);
        setDataLoaded(true);
    });
    
    return (
        <div>
            <Layout dataLoaded={true}>
                <h1>Perfil</h1>
                <div className={Styles.columns}>
                    <div className={Styles.container}>
                        <div className={Styles.header}>
                            <span>Informacion basica</span>
                            <button className={Styles.button} onClick={() =>
                                updateProfileData({
                                    name: nameRef.current.value,
                                    lastName: lastNameRef.current.value,
                                    email: emailRef.current.value,
                                    role: data.role,
                                    project: data.project,
                                    client: data.client,
                                })
                            }>
                                Guardar cambios
                            </button>
                        </div>

                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Nombre</label>
                            </div>
                            <input type="text" defaultValue={data.name} ref={nameRef} />
                        </div>

                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Apellido</label>
                            </div>
                            <input type="text" defaultValue={data.lastName} ref={lastNameRef} />
                        </div>

                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Email</label>
                            </div> 
                            <input type='text' defaultValue={data.email} ref={emailRef} />
                        </div>

                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Rol</label>
                            </div>
                            <span>{data.role}</span>
                        </div>

                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Proyecto</label>
                            </div>
                            <span>{data.project}</span>
                        </div>

                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Cliente</label>
                            </div>
                            <span>{data.client}</span>
                        </div>
                    </div>

                    <div className={Styles.container}>
                        <div className={Styles.header}>
                            <span>Seguridad</span>
                            <button className={Styles.button} onClick={() =>
                                newPasswordRef.current.value == confirmPasswordRef.current.value ?
                                updatePasswordUser(currentPasswordRef.current.value, newPasswordRef.current.value) :
                                toast.error('Las contraseñas no coinciden')
                            }>
                                Actualizar
                            </button>
                        </div>
                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Contraseña actual</label>
                            </div>
                            <input type="password" ref={currentPasswordRef} />
                        </div>
                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Nueva contraseña</label>
                            </div>
                            <input type="password" ref={newPasswordRef} />
                        </div>
                        <div className={Styles.field}>
                            <div className={Styles.containerLabel}>
                                <label>Confirmar contraseña</label>
                            </div>
                            <input type="password" ref={confirmPasswordRef} />
                        </div> 
                    </div>
                </div>
            </Layout>
        </div>
    )
}