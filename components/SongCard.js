// components/SongCard.js
import { useRef, useState } from 'react';
import { initializeWeb3, streamSong } from '../utils/web3';

const SongCard = ({ song }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handlePlay = async () => {
        if (audioRef.current) {
            await initializeWeb3();
            try {
                if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                } else {
                    audioRef.current.play();
                    setIsPlaying(true);
                    // Call the streamSong function from MusicStreamingPlatform smart contract
                    await streamSong(song.tokenId); // Pass the tokenId to stream the song
                }
            } catch (error) {
                console.error("Error while streaming the song:", error);
            }
        }
    };

    return (
        <div className="song-container">
            <h3 className="song-title">
                {song.name} by {song.artist}
            </h3>
            <p className="stream-count">Stream Count: {song.streamCount}</p>

            {/* Audio player for the song */}
            <audio ref={audioRef} src={song.ipfsHash} preload="metadata" className="audio-player" />

            <button onClick={handlePlay} className="play-button">
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>

    );
};

export default SongCard;