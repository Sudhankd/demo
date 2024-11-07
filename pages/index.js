// pages/index.js
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import ConnectWallet from '../components/ConnectWallet';

const Home = () => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.requestAccounts();
                setAccount(accounts[0]);
            }
        };
        loadWeb3();
    }, []);

    return (
        <div>
            <h1>Welcome to MusicCurrency</h1>
            {!account ? <ConnectWallet /> : <h2>Connected: {account}</h2>}
        </div>
    );
};

export default Home;