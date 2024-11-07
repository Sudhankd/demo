import { useState } from 'react';
import { initializeWeb3, mintMusicNFT, listNFTForSale ,approveNFT} from '../utils/web3'; // Ensure you have web3.js functions imported

const MintNFT = () => {
    const [numberOfNFTs, setNumberOfNFTs] = useState(1); // Default to 1 NFT
    const [pricePerNFT, setPricePerNFT] = useState(0); // Price for each NFT
    const [minting, setMinting] = useState(false);
    const [transactionHash, setTransactionHash] = useState('');
    const [error, setError] = useState('');
    const [nftName, setNftName] = useState(''); // Name of the NFT
    const [nftDescription, setNftDescription] = useState(''); // Description of the NFT

    const handleMint = async () => {
        if (numberOfNFTs <= 0) {
            setError('Please specify a valid number of NFTs to mint');
            return;
        }
        if (pricePerNFT <= 0) {
            setError('Please specify a valid price for the NFT');
            return;
        }
    
        try {
            setError('');
            setMinting(true);
    
            // Loop to mint NFTs
            await initializeWeb3();
            for (let i = 0; i < numberOfNFTs; i++) {
                // Generate a unique token URI based on the NFT's name, description, and a unique tokenId
                const tokenURI = `data:application/json;utf-8,{"name":"${nftName} #${i + 1}","description":"${nftDescription}"}`;
    
                // Mint the NFT and get the tokenId
                const tokenId = await mintMusicNFT(tokenURI);
    
                // Approve the marketplace contract to transfer the NFT
                await approveNFT(tokenId);
    
                // List the NFT for sale
                const listTx = await listNFTForSale(tokenId, pricePerNFT);
                console.log("NFT listed for sale", listTx.transactionHash);
    
                // Optional: Update UI or state with the result (e.g., displaying transaction hash)
            }
    
            setMinting(false);
        } catch (err) {
            setMinting(false);
            setError('Minting failed. Please try again.');
            console.error(err);
        }
    };
    

    return (
        <div className="container">
            <h1 className="title">Mint Your Own NFT</h1>
            
            <div className="form-group">
                <label htmlFor="nfts" className="label">Number of NFTs to mint:</label>
                <input
                    id="nfts"
                    type="number"
                    value={numberOfNFTs}
                    onChange={(e) => setNumberOfNFTs(e.target.value)}
                    min="1"
                    max="100"
                    className="input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="price" className="label">Price per NFT (in AUDIO tokens):</label>
                <input
                    id="price"
                    type="number"
                    value={pricePerNFT}
                    onChange={(e) => setPricePerNFT(e.target.value)}
                    min="0"
                    step="any"
                    className="input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="nftName" className="label">NFT Name:</label>
                <input
                    id="nftName"
                    type="text"
                    placeholder="Enter NFT name"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    className="input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="nftDescription" className="label">NFT Description:</label>
                <input
                    id="nftDescription"
                    type="text"
                    placeholder="Enter NFT description"
                    value={nftDescription}
                    onChange={(e) => setNftDescription(e.target.value)}
                    className="input"
                />
            </div>

            <button onClick={handleMint} disabled={minting} className="button">
                {minting ? 'Minting...' : 'Mint NFTs'}
            </button>

            {transactionHash && (
                <div className="success-message">
                    <p>Minting successful!</p>
                </div>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>

    );
};

export default MintNFT;
