import React, { useState } from 'react';

interface ReportIssueProps {
    onCancel?: () => void;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ onCancel }) => {
    const [issue, setIssue] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(`Issue reported: ${issue}`);
        setIssue('');
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.header}>Report technical issue</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="issueInput" style={styles.label}>
                        Please specify
                    </label>
                    <textarea
                        id="issueInput"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        style={styles.textarea}
                        placeholder="Describe your issue here"
                    />
                    <div style={styles.buttonContainer}>
                        <button type="button" onClick={onCancel} style={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitButton}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '50%',
        maxWidth: '500px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'left' as const,
        fontSize: '24px',
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
    },
    textarea: {
        width: '100%',
        height: '150px',
        marginBottom: '10px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    cancelButton: {
        backgroundColor: '#ffffff',
        color: '#6b7280',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginRight: '60px',
    },
    submitButton: {
        backgroundColor: '#f59e0b',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default ReportIssue;
