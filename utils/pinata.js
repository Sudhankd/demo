// utils/pinata.js
import axios from 'axios';

const pinataApiKey = 'd6485376ae3b8108c6c3';
const pinataSecretApiKey = 'e6089bd43ae7a1499c25df6a7ea776d3355ea70447acdde1873eab6edb839616';

const pinFileToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
        },
    });

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
};

export { pinFileToIPFS };
