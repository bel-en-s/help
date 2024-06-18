import React, { useState } from 'react';
import styles from '../../styles/ui-kit/Tabs.module.css';

const Tabs = ({ tabs, sidebarVisible }) => {
    const [activeTab, setActiveTab] = useState(0);
    const handleTabClick = (index) => {
        setActiveTab(index);
    };
    console.log(sidebarVisible)
    const tabsContainerClass = sidebarVisible ? `${styles.tabsContainer} ${styles.hidden}` : styles.tabsContainer;

    return (
        <div>
            <div className={tabsContainerClass}>
                {tabs.map((tab, index) => (
                    <div key={index} className={index === activeTab ? styles.activeTab : ''}>
                        <div
                            key={index}
                            onClick={() => handleTabClick(index)}
                            className={styles.tabButton}
                        >
                            {tab.label}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.tabContent}>
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
