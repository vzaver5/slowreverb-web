import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import { Audio } from "react-loader-spinner";
import "./drag-drop.css";
import SpeedSlider from "./Speedslider.js";

function Spinner() {
    return <Audio
        height="80"
        width="80"
        radius="9"
        color="#1b1f3b"
        ariaLabel="audio-loading"
        wrapperStyle
        wrapperClass
    />;
}

const checkFileType = (file, index) => {
    console.log("file has been added");

    if(!file.name.includes(".flac")) {
        alert("Upload ONLY .flac files.")
        this.handleRemoveFile(index);
    }

}

const DragNdrop = ({
    onFilesSelected,
    width,
    height,
}) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [sliderValue, setSliderValue] = useState(.80);

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

    async function runFlaskSlowReverbWork(files) {
        if (!files || files.length === 0) {
            alert('Please select at least one file');
            return;
        }
        setLoading(true);   //Show the spinner

        try {
            for (const file of files) {
                console.log("Uploading file: ", file.name);
                const formData = new FormData();
                formData.append('file', file);
                formData.append('speed', sliderValue);           //Add the sliderValue to the formData so it knows what speed to set.
                console.log(file);
                console.log(sliderValue);

                const response = await fetch('https://slowreverbsoundbot.pythonanywhere.com/process-file', {
                    method: 'POST',
                    body: formData,
                    signal: AbortSignal.timeout(600000)
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error);
                }

                const blob = await response.blob();
                const slowedReverberatedFile = file.name.split(".")[0].concat("SlowedReverbedFree.wav");
                const url = URL.createObjectURL(blob);

                //Download file after processing
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = slowedReverberatedFile;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                console.log("File name received", file.name);
            }
            console.log("All files processed and downloaded succesfully")
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

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
                            <p>Supported files: .flac, .wav, .mp3</p>
                        </div>
                    </div>
                    <input
                        type="file"
                        hidden
                        id="browse"
                        onChange={handleFileChange}
                        accept="audio/*"
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
                                <div className="file-item" key={index} style={{ display: "flex"}}>
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

            <div style={{ padding: "10px" }}>
                {files.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center' }} className="success-file">
                        {loading && (
                            <div className="spinner-overlay">
                                <div className="spinner-content">
                                    <Spinner />
                                    <div className="audio-loader-text"> Loading...</div>
                                </div>
                            </div>
                        )}
                        <SpeedSlider value={sliderValue} setValue={setSliderValue} />
                        <button style={{ marginLeft: '8%' }} type="button" className="upload-btn" onClick={() => runFlaskSlowReverbWork(files)}>SlowAndReverberate</button>
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
