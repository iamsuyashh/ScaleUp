import React, { useState } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Cloud, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 

const FileUploadComponent = () => {
    const { isSignedIn } = useUser(); 
    const navigate = useNavigate();
    
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [errors, setErrors] = useState({});

    const isValidFile = (file) => file.type === "text/csv";

    const handleFileInput = (e) => {
        if (!isSignedIn) {
            navigate("/sign-in"); // Redirect if not signed in
            return;
        }
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold text-center mb-4">Upload</h1>

            <motion.div
                className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors relative
                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                ${files.length > 0 ? "border-solid" : ""}`}
            >
                <div className="text-center">
                    <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                        Drag & drop files or{" "}
                        <label 
                            className="text-blue-500 cursor-pointer hover:text-blue-600"
                            onClick={(e) => { 
                                if (!isSignedIn) {
                                    e.preventDefault(); // Prevent default if not signed in
                                    navigate("/sign-in"); 
                                }
                            }}
                        >
                            Browse
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".csv" 
                                onChange={handleFileInput} 
                                multiple 
                            />
                        </label>
                    </p>
                    <p className="text-sm text-gray-500">Supported formats: CSV</p>
                </div>
            </motion.div>

            <motion.button
                className="w-full p-3 bg-indigo-500 text-white rounded-lg mt-4 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={files.length === 0}
            >
                UPLOAD FILES
            </motion.button>
        </div>
    );
};

export default FileUploadComponent;
