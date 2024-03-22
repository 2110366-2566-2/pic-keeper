import React from 'react';
import Image from 'next/image';
import checkmarkImage from '../../../public/images/Checkmark.png';

const PaymentSuccessful: React.FC = () => {
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.checkIconContainer}>
                    <Image
                        src={checkmarkImage}
                        alt="Checkmark"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <h2 style={styles.successMessage}>Payment Successful</h2>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center' as const,
        maxWidth: '300px',
    },
    checkIconContainer: {
        position: 'relative' as const,
        width: '30vw',
        height: '30vw',
        maxWidth: '120px',
        maxHeight: '120px',
        margin: '0 auto 20px',
    },
    successMessage: {
        margin: '20px 0',
        fontSize: '24px',
        color: '#000000',
    },
};

export default PaymentSuccessful;