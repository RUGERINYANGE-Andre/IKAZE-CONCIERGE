// client/src/components/dashboard/admin/FileUploader.jsx

import React, { useState, useRef } from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { formatFileSize, getFileIcon } from '../../../utils/helpers';

const FileUploader = ({ 
  orderId, 
  onUploadSuccess, 
  maxFiles = 10, 
  maxFileSize = 50 * 1024 * 1024, // 50MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'video/mp4', 'video/quicktime', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileType, setFileType] = useState('document');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const fileTypes = [
    { value: 'itinerary', label: 'Itinerary', icon: '📋' },
    { value: 'photo', label: 'Photo', icon: '📸' },
    { value: 'video', label: 'Video', icon: '🎥' },
    { value: 'document', label: 'Document', icon: '📄' },
    { value: 'report', label: 'Report', icon: '📊' },
    { value: 'other', label: 'Other', icon: '📎' },
  ];

  const validateFile = (file) => {
    const errors = [];

    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`${file.name}: File size exceeds ${formatFileSize(maxFileSize)}`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: File type not allowed`);
    }

    return errors;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newErrors = [];

    // Check total number of files
    if (selectedFiles.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at a time`);
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      const fileErrors = validateFile(file);
      newErrors.push(...fileErrors);
      return fileErrors.length === 0;
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000);
    }

    // Add valid files with preview URLs
    const filesWithPreviews = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));

    setSelectedFiles(prev => [...prev, ...filesWithPreviews]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Revoke object URL to prevent memory leaks
      const removed = prev.find(f => f.id === fileId);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setUploading(true);
    setErrors([]);

    try {
      const formData = new FormData();
      
      selectedFiles.forEach(({ file }) => {
        formData.append('files', file);
      });
      
      formData.append('fileType', fileType);
      
      if (description) {
        formData.append('description', description);
      }

      // Using fetch for upload progress tracking
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/files`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Clean up
      selectedFiles.forEach(({ preview }) => {
        if (preview) URL.revokeObjectURL(preview);
      });

      setSelectedFiles([]);
      setDescription('');
      setFileType('document');
      
      alert('✅ Files uploaded successfully!');
      
      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(['Failed to upload files. Please try again.']);
    } finally {
      setUploading(false);
    }
  };

  const getFileTypeIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎬';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('word')) return '📝';
    return '📄';
  };

  return (
    <div className="space-y-6">
      {/* File Type Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-darkGray mb-3">
          File Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {fileTypes.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFileType(type.value)}
              className={`
                flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all
                ${fileType === type.value
                  ? 'border-primary-teal bg-primary-teal/10 text-primary-teal'
                  : 'border-neutral-lightGray hover:border-primary-teal/50 text-neutral-darkGray'
                }
              `}
            >
              <span className="text-xl">{type.icon}</span>
              <span className="font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-neutral-darkGray mb-3">
          Select Files <span className="text-red-500">*</span>
        </label>
        
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-lightGray rounded-lg p-8 text-center cursor-pointer hover:border-primary-teal transition-colors bg-neutral-offWhite"
        >
          <div className="text-5xl mb-4">📎</div>
          <p className="text-neutral-darkNavy font-medium mb-2">
            Click to select files
          </p>
          <p className="text-sm text-neutral-gray">
            Max {maxFiles} files • Max {formatFileSize(maxFileSize)} per file
          </p>
          <p className="text-xs text-neutral-gray mt-2">
            Supported: Images, PDFs, Videos, Documents
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-semibold mb-2">⚠️ Upload Errors:</p>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-darkGray mb-3">
            Selected Files ({selectedFiles.length})
          </label>
          <div className="space-y-3">
            {selectedFiles.map(({ file, id, preview }) => (
              <Card key={id} padding={false}>
                <div className="flex items-center p-4 space-x-4">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {preview ? (
                      <img 
                        src={preview} 
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-lightGray rounded-lg flex items-center justify-center text-3xl">
                        {getFileTypeIcon(file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-darkNavy truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-neutral-gray">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-sm text-neutral-gray">
                        {file.type.split('/')[1].toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(id)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-2"
                    disabled={uploading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Description (Optional) */}
      <div>
        <label className="block text-sm font-medium text-neutral-darkGray mb-2">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="input-field resize-none"
          placeholder="Add a note about these files..."
          disabled={uploading}
        />
      </div>

      {/* Upload Stats */}
      <div className="bg-neutral-offWhite rounded-lg p-4 flex items-center justify-between">
        <div className="text-sm text-neutral-darkGray">
          <span className="font-medium">{selectedFiles.length}</span> file(s) selected
          {selectedFiles.length > 0 && (
            <span className="ml-2">
              • Total size: <span className="font-medium">
                {formatFileSize(selectedFiles.reduce((acc, { file }) => acc + file.size, 0))}
              </span>
            </span>
          )}
        </div>
        <div className="text-sm text-neutral-gray">
          {maxFiles - selectedFiles.length} slots remaining
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            selectedFiles.forEach(({ preview }) => {
              if (preview) URL.revokeObjectURL(preview);
            });
            setSelectedFiles([]);
            setDescription('');
          }}
          disabled={selectedFiles.length === 0 || uploading}
          className="flex-1"
        >
          Clear All
        </Button>
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
          loading={uploading}
          className="flex-1"
        >
          {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
        </Button>
      </div>

      {/* Upload Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 font-semibold mb-2">💡 Upload Tips</p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Choose the correct file type for better organization</li>
          <li>Add descriptions to help clients understand the files</li>
          <li>Clients will be notified via email when files are uploaded</li>
          <li>Images are automatically optimized for faster downloads</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;