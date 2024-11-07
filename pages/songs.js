import { useEffect, useState } from 'react';
import { initializeWeb3, musicStreamingPlatformContract } from '../utils/web3';
import SongCard from '../components/SongCard';

const Songs = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const loadSongs = async () => {
            // Initialize web3 and contract instances
            await initializeWeb3();

            try {
                // Get the total number of songs using getTokenIdCounter
                const totalSongs = await musicStreamingPlatformContract.methods.getTokenIdCounter().call();
                console.log(totalSongs);
                let songData = [];

                // Iterate over all the songs using the tokenIdCounter
                for (let i = 0; i < totalSongs; i++) {
                    const song = await musicStreamingPlatformContract.methods.getSongDetails(i).call();
                    console.log(song);
                    const { ipfsHash, artist, streamCount } = song;

                    songData.push({
                        tokenId: i,
                        ipfsHash,
                        artist,
                        streamCount,
                    });
                }

                setSongs(songData);
            } catch (error) {
                console.error("Error loading songs:", error);
            }
        };

        loadSongs();
    }, []);

    return (
        <div>
            <h1>Available Songs</h1>
            <input type="text" placeholder="Search..." />
            <div>
                {songs.map((song) => (
                    <SongCard key={song.tokenId} song={song} />
                ))}
            </div>
        </div>
    );
};

export default Songs;
