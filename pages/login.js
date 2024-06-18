import React, { useState } from 'react';
import { logIn, signUp } from '../utils/auth';
import styles from '../styles/Login.module.css';
import { Toaster } from 'react-hot-toast';

// Poner contraseña incorrecta si falla login

export default function Login() {
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    async function handleSignUp() {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        signUp(email, password);
    }

    async function handleLogin() {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        logIn(email, password);
    }

    return (
        <div>
            <div className={styles.navbar}>
                <div className={styles.logoContainer}>
                    <img className={styles.logo} src="/img/logo.png" alt="Logo" />
                </div>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.leftSide}>
                        <div className={styles.textContainer}>
                            <div>
                                <h1 className={styles.title}>Todos tus proyectos en un solo lugar</h1>
                                <h2 className={styles.subTitle}>Comenzá a gestionar de una manera más sencilla.</h2>
                            </div>
                        </div>
                    </div>
                    <div className={styles.rightSide}>
                        <div className={styles.form}>
                            <Toaster />
                            <h2 className={styles.subTitle}>Inicia sesión para <br /> continuar</h2>
                            <input className={styles.input} ref={emailRef} type="text" placeholder="Usuario" />
                            <br/>
                            <div className={styles.passwordContainer}>
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                />
                                <img
                                    className={styles.passwordToggle}
                                    src={showPassword ? '/img/hidden.png' : '/img/visible.png'}
                                    alt={showPassword ? 'Hide' : 'Show'} Password
                                    onClick={togglePasswordVisibility}
                                />
                            </div>
                            <br />
                            <div className={styles.container}>
                                <div className={styles.rememberMe}>
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <label htmlFor="rememberMe">Recordarme</label>
                                </div>
                                <div className={styles.buttonContainer}>
                                    <button onClick={handleLogin}>Ingresar</button>
                                </div>
                            </div>
                            <h3 className={styles.forgot}>Olvidé mi contraseña</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
