import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FileUploadComponent = () => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileInput = async (e) => {
        if (!isSignedIn) {
            navigate("/sign-in");
            return;
        }

        const file = e.target.files[0];
        if (!file) return;
    
        setUploading(true);
        setError(null);
        setProgress(10);
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });
            const result = await response.json();
    
            if (result.error) {
                setError(result.error);
            } else {
                setProgress(100);
                setTimeout(() => navigate("/dashboard"), 500);
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
                {uploading && (
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default FileUploadComponent;