import Head from "next/head";
import { useEffect, useState } from "react";
import { authState } from "../utils/auth";
import Loading from "./Loading";
import Sidebar from "./ui-kit/Sidebar";
import styles from "../styles/Layout.module.css";

export default function Layout({ children, dataLoaded}) {
    const [user, setUser] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [popUpSidePanelOpen, setPopUpSidePanelOpen] = useState(false);
    const [popUpSelected, setPopUpSelected] = useState(null);

    const sidebarStyles = sidebarVisible ? styles.sidebar : `${styles.sidebar} ${styles.sidebarHidden}`;

    const updateSidebarVisibility = (isVisible) => {
        setSidebarVisible(isVisible);
        if (popUpSidePanelOpen && !isVisible) {
            console.log("Pop-up side panel open but not visible");
        }
    };

    useEffect(() => {
        let parsedRoute = window.location.pathname.split("/");
        authState(setUser, parsedRoute[1]);
    }, []);

    useEffect(() => {
        console.log("Pop-up side panel open:", popUpSidePanelOpen);
        console.log("Pop-up selected:", popUpSelected);
    }, [popUpSidePanelOpen, popUpSelected]);

    console.log(sidebarVisible)

    return (
        <div className={styles.main}>
            <Head>
                <title>NW Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Sidebar
                updateSidebarVisibility={updateSidebarVisibility}
                views={user?.views}
                setPopUpSidePanelOpen={setPopUpSidePanelOpen}
                setPopUpSelected={setPopUpSelected}
            />
            <div className={sidebarStyles}>
                {dataLoaded !== false ? (
                    <>
                        {children ? children : null}
                    </>
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
}
