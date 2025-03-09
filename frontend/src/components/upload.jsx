import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const FileUploadComponent = () => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileInput = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            // Upload file to Flask
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
    
            if (result.error) {
                setError(result.error);
            } else {
                // Store minimal info, then fetch full dataset in Dashboard
                navigate("/dashboard");
            }
        } catch (error) {
            setError("Upload failed. Please try again.");
            console.error("Upload failed:", error);
        }
        setUploading(false);
    };
    
    

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold text-center mb-4">Upload CSV</h1>
            <div className="border-2 border-dashed rounded-lg p-8 mb-4 text-center">
                <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label className="text-blue-500 cursor-pointer hover:text-blue-600">
                    Browse
                    <input 
                        type="file" 
                        className="hidden" 
                        accept=".csv" 
                        onChange={handleFileInput} 
                    />
                </label>
                {uploading && <p className="text-gray-500 mt-2">Uploading...</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default FileUploadComponent;
