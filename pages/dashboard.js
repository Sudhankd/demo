// pages/dashboard.js
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';

const Dashboard = () => {
    const [account, setAccount] = useState(null);
    const [showButtons, setShowButtons] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.requestAccounts();
                setAccount(accounts[0]);
                setShowButtons(true); // Show buttons after account is set
            } else {
                router.push('/');
            }
        };
        loadWeb3();
    }, [router]);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Dashboard</h1>
            {account ? (
                <div style={styles.buttonContainer}>
                    {showButtons && (
                        <>
                            <button
                                style={{ ...styles.button, animationDelay: '0.5s' }}
                                onClick={() => router.push('/upload')}
                            >
                                Upload Track
                            </button>
                            <button
                                style={{ ...styles.button, animationDelay: '1s' }}
                                onClick={() => router.push('/songs')}
                            >
                                Listen to Songs
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <h2 style={styles.connectMessage}>Please connect your wallet</h2>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f4f8',
        textAlign: 'center',
    },
    header: {
        fontSize: '2.5rem',
        color: '#333',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '20px',
    },
    button: {
        padding: '15px 30px',
        fontSize: '1.25rem',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        opacity: 0,
        animation: 'fadeIn 1s forwards',
    },
    connectMessage: {
        fontSize: '1.5rem',
        color: '#777',
    },
};

// Keyframes for button fade-in effect
const keyframes = `
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}`;

// Inject keyframes into the document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
}

export default Dashboard;
