import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import "./drag-drop.css";

function runFlaskSlowReverbWork(file) {
    alert("Button Pressed")
    console.log("Uploading file: ", file.name);

    if (!file) {
        alert('Please select a file first');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://127.0.0.1:5000/process-file', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log("Response Status: ", response.status);
        console.log("Response Headers: ", [...response.headers.entries()]);

        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.blob();
    })
    .then(blob => {
        console.log("Received blob", blob);

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('File processed and downloaded successfully');
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

const DragNdrop = ({
    onFilesSelected,
    width,
    height,
}) => {
    const [files, setFiles] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles = Array.from(selectedFiles);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            const newFiles = Array.from(droppedFiles);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    useEffect(() => {
        onFilesSelected(files);
    }, [files, onFilesSelected]);

    return (
        <section className="drag-drop" style={{ width: width, height: height }}>
            <div
                className={`document-uploader ${files.length > 0 ? "upload-box active" : "upload-box"
                    }`}
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
            >
                <>
                    <div className="upload-info">
                        <AiOutlineCloudUpload />
                        <div>
                            <p>Drag and drop your files here</p>
                            <p>Supported file: .flac</p>
                        </div>
                    </div>
                    <input
                        type="file"
                        hidden
                        id="browse"
                        onChange={handleFileChange}
                        accept=".flac"
                        multiple
                    />
                    <label htmlFor="browse" className="browse-btn">
                        Browse files
                    </label>
                </>

                {files.length > 0 && (
                    <div className="file-list">
                        <div className="file-list__container">
                            {files.map((file, index) => (
                                <div className="file-item" key={index}>
                                    <div className="file-info">
                                        <p>{file.name}</p>
                                    </div>
                                    <div className="file-actions">
                                        <MdClear onClick={() => handleRemoveFile(index)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                {files.length > 0 && (
                    <div className="success-file">
                        <button type="button" className="upload-btn" onClick={() => runFlaskSlowReverbWork(files[0])}>SlowAndReverberate</button>
                        {downloadUrl && (
                            <a href={downloadUrl} download="processed_audio.wav">Download Processed File</a>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DragNdrop;
