// components/NavBar.js
import { useEffect, useState } from 'react';
import Web3 from 'web3';

const NavBar = () => {
    const [account, setAccount] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } catch (error) {
                console.error("User denied account access:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    useEffect(() => {
        const checkAccount = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            }
        };
        checkAccount();
    }, []);

    return (
        <nav style={styles.navbar}>
            <h1 style={styles.title}>MusicCurrency</h1>
            <div style={styles.links}>
                <a href="/">Home</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/uploadSong">Upload Song</a>
                <a href="/songsDashboard">Songs Dashboard</a>
                <a href="/marketplace">NFT Marketplace</a>
            </div>
            <div style={styles.wallet}>
                {account ? (
                    <span>Connected: {account}</span>
                ) : (
                    <button onClick={connectWallet} style={styles.button}>
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#282c34',
        color: 'white',
    },
    title: {
        fontSize: '24px',
    },
    links: {
        display: 'flex',
        gap: '15px',
    },
    wallet: {
        display: 'flex',
        alignItems: 'center',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#61dafb',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default NavBar;