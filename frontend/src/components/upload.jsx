import React, { useState } from 'react';
import { Cloud, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploadComponent = () => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [errors, setErrors] = useState({});

    const isValidFile = (file) => {
        return file.type === 'text/csv';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
    };

    const processFiles = (newFiles) => {
        newFiles.forEach(file => {
            if (!isValidFile(file)) {
                setErrors(prev => ({
                    ...prev,
                    [file.name]: 'This document is not supported, please delete and upload another file.'
                }));
            } else {
                setFiles(prev => [...prev, file]);
                simulateUpload(file.name);
            }
        });
    };

    const simulateUpload = (fileName) => {
        setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                const newProgress = (prev[fileName] || 0) + 10;
                if (newProgress >= 100) {
                    clearInterval(interval);
                }
                return { ...prev, [fileName]: Math.min(newProgress, 100) };
            });
        }, 200);
    };

    const removeFile = (fileName) => {
        setFiles(prev => prev.filter(file => file.name !== fileName));
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fileName];
            return newErrors;
        });
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileName];
            return newProgress;
        });
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold text-center mb-4">Upload</h1>

            <motion.div
                className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors relative
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${files.length > 0 ? 'border-solid' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-center">
                    <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                        Drag & drop files or{' '}
                        <label className="text-blue-500 cursor-pointer hover:text-blue-600">
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
                    <p className="text-sm text-gray-500">
                        Supported formats: CSV
                    </p>
                </div>
            </motion.div>

            <AnimatePresence>
                {Object.keys(errors).map((fileName) => (
                    <motion.div
                        key={`error-${fileName}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-2"
                    >
                        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-600">{fileName}</span>
                            </div>
                            <button
                                onClick={() => removeFile(fileName)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-red-500 mt-1">{errors[fileName]}</p>
                    </motion.div>
                ))}

                {files.map((file) => (
                    <motion.div
                        key={file.name}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-2"
                    >
                        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <button
                                onClick={() => removeFile(file.name)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {uploadProgress[file.name] < 100 && (
                            <div className="h-1 bg-gray-200 rounded-full mt-2">
                                <motion.div
                                    className="h-full bg-indigo-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress[file.name]}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>

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