// pages/marketplace.js
import { useEffect, useState } from 'react';
import { getAllListings, initializeWeb3 } from '../utils/web3'; // Import the function to fetch all listings
import ListingCard from '../components/ListingCard'; // Import the ListingCard component for each NFT listing

const Marketplace = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true); // For showing a loading state

    // Fetch listings when component mounts
    useEffect(() => {
        const loadListings = async () => {
            await initializeWeb3();
            try {
                const listingData = await getAllListings(); // Fetch all listings from contract
                console.log(listingData)
                setListings(listingData); // Update state with fetched data
            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setLoading(false); // Stop loading state
            }
        };

        loadListings(); // Call function to load listings
    }, []); // Empty dependency array ensures this runs once when component mounts

    return (
        <div>
            <h1>NFT Marketplace</h1>

            {loading ? (
                <div>Loading listings...</div> // Show loading message while fetching data
            ) : (
                <div>
                    {listings.length === 0 ? (
                        <div>No NFTs available for sale.</div> // Display message if no listings exist
                    ) : (
                        <div>
                            {listings.map((listing) => (
                                <ListingCard key={listing.tokenId} listing={listing} /> // Display each listing
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Marketplace;

