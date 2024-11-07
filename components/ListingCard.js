import React, { useState } from 'react';
import { purchaseNFT, initializeWeb3 } from '../utils/web3'; // Import the function to fetch all listings

const ListingCard = ({ listing }) => {
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [error, setError] = useState(null);

    const handleBuy = async () => {
        setIsPurchasing(true);
        setError(null); // Reset any previous errors
        await initializeWeb3();
        try {
            // Call the purchaseNFT function from web3.js
            const tx = await purchaseNFT(listing.tokenId);
            console.log('Transaction successful:', tx);
            // You can add more logic here, like updating the UI with the transaction status or success message
        } catch (err) {
            console.error('Error during purchase:', err);
            setError('Failed to purchase NFT. Please try again.');
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <div className="listing-card">
            <h3>NFT {listing.tokenId}</h3>
            <p>Price: {listing.price} AUDIO</p>
            <p>Seller: {listing.seller}</p>
            {/* Add other NFT details such as image, name, description, etc. */}
            <button onClick={handleBuy} disabled={isPurchasing}>
                {isPurchasing ? 'Processing...' : 'Buy Now'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ListingCard;