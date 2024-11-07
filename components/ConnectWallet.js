// components/ConnectWallet.js
const ConnectWallet = () => {
    const handleConnect = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Reload the page to show the connected account
            window.location.reload();
        } else {
            alert('Please install MetaMask!');
        }
    };

    return <button onClick={handleConnect}>Connect MetaMask</button>;
};

export default ConnectWallet;