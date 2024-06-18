import React from 'react';
import styles from '../../styles/ui-kit/Modal.module.css';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    openModal = () => {
        this.setState({ isOpen: true });
        document.body.style.overflow = 'hidden';
    };

    closeModal = () => {
        this.setState({ isOpen: false });
        document.body.style.overflow = 'unset';
    };

    handleContainerClick = (e) => {
        const modalContent = e.target.closest(`.${styles.modalContent}`);
        if (!modalContent) {
            this.closeModal();
        }
    };
    

    render() {
        return (
            <div>
                {this.state.isOpen && (
                    <div className={styles.modalContainer} onClick={this.handleContainerClick}>
                        <div className={styles.modalContent}>
                            <button className={styles.closeButton} onClick={this.closeModal}>
                                &times;
                            </button>
                            {this.props.children}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
