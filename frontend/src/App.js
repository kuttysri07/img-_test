import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./App.css"

const App = () => {
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const uploadHandler = () => {
        if (!file) {
            alert("Please select a file before uploading!");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        axios.post(`${API_BASE_URL}/upload`, formData)
            .then(res => {
                console.log(res);
                fetchImages();  // Refresh the image list after upload
            })
            .catch(err => console.log(err));
    };
    
    const fetchImages = () => {
        axios.get(`${API_BASE_URL}/getImage`)
            .then(res => {
                setImages(res.data);  // Set all images from the response data
            })
            .catch(err => console.log(err));
    };
    

    useEffect(() => {
        fetchImages();  // Fetch images on component mount
    }, []);

    return (
        <div>
            <input type='file' onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={uploadHandler}>Upload</button>
            <br/>
            <div>
                {images.map((img, index) => (
                    <img className="uploaded-image" key={index} src={`http://localhost:8000/images/${img.image}`} alt={`Uploaded ${index}`} style={{ width: '200px', margin: '10px' }} />
                ))}
            </div>
        </div>
    );
}

export default App;
