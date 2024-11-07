// pages/upload.js
import { useState } from 'react';
import { pinFileToIPFS } from '../utils/pinata';
import web3, { uploadSong } from '../utils/web3';
import { initializeWeb3, musicStreamingPlatformContract } from '../utils/web3';
import { useRouter } from 'next/router';

const UploadSong = () => {
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState('');
    const router = useRouter();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            const hash = await pinFileToIPFS(file);
            setIpfsHash(hash);
            console.log("along");
            await initializeWeb3();
            try {
                console.log("inside sohan");
                // Get the total number of songs using getTokenIdCounter
                await uploadSong(hash);
                // console.log(totalSongs);
                // let songData = [];
            }
            catch (error) {
                console.error("Error loading songs:", error);
            }
            // await uploadSong(hash);
            // Call your smart contract's uploadSong function here with hash
            // Example: await contract.methods.uploadSong(hash).send({ from: account });
            // router.push('/dashboard'); // Redirect after upload
        }
    };

    return (
        <div>
            <h1>Upload a Song</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {ipfsHash && <p>Uploaded to IPFS: {ipfsHash}</p>}
        </div>
    );
};

export default UploadSong;
