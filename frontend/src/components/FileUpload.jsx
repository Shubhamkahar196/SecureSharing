import { useState, useCallback, useRef } from 'react';
import { fileAPI } from '../services/api';
import toast from 'react-hot-toast';

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

const FileUpload = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    password: '',
    expirationHours: '',
    viewLimit: '',
  });
  const [uploading, setUploading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef();

  // ===============================
  // File Change
  // ===============================
  const handleFileChange = useCallback((e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/') && !selected.type.startsWith('video/')) {
      return toast.error('Only image & video allowed');
    }

    if (selected.size > MAX_SIZE) {
      return toast.error('Max size 100MB');
    }

    setFile(selected);
  }, []);

  // ===============================
  //  Input Change
  // ===============================
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // ===============================
  //  Upload
  // ===============================
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!file) {
      return toast.error('Select a file first');
    }

    setUploading(true);
    setProgress(0);

    try {
      const data = new FormData();
      data.append('file', file);

      if (formData.password) data.append('password', formData.password);
      if (formData.expirationHours) data.append('expirationHours', formData.expirationHours);
      if (formData.viewLimit) data.append('viewLimit', formData.viewLimit);

      const res = await fileAPI.upload(data, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setShareLink(res.data.shareLink);
      onFileUploaded(res.data.file);

      toast.success('Upload successful ');

      // reset
      setFile(null);
      setFormData({ password: '', expirationHours: '', viewLimit: '' });
      fileInputRef.current.value = '';

    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [file, formData, onFileUploaded]);

  // ===============================
  //  Copy Link
  // ===============================
  const copyShareLink = useCallback(async () => {
    try {
      const link = `${window.location.origin}/view/${shareLink}`;
      await navigator.clipboard.writeText(link);
      toast.success('Copied ');
    } catch {
      toast.error('Copy failed');
    }
  }, [shareLink]);

  // ===============================
  //  UI
  // ===============================
  return (
    <div className="file-upload">
      <h3>Upload File</h3>

      {shareLink && (
        <div className="share-link-container">
          <h4>Success 🎉</h4>
          <div className="share-link">
            <input
              value={`${window.location.origin}/view/${shareLink}`}
              readOnly
            />
            <button onClick={copyShareLink} className="btn btn-secondary">
              Copy
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Select File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          {file && (
            <div className="file-info">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Password (Optional)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="expirationHours"
            value={formData.expirationHours}
            onChange={handleInputChange}
            placeholder="Expire (hours)"
          />
          <input
            type="number"
            name="viewLimit"
            value={formData.viewLimit}
            onChange={handleInputChange}
            placeholder="View limit"
          />
        </div>

        {/*  Progress Bar */}
        {uploading && (
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>
        )}

        <button disabled={uploading} className="btn btn-primary">
          {uploading ? `Uploading ${progress}%` : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;







// import { useState } from 'react';
// import { fileAPI } from '../services/api';

// const FileUpload = ({ onFileUploaded }) => {
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     password: '',
//     expirationHours: '',
//     viewLimit: '',
//   });
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [shareLink, setShareLink] = useState('');

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       // Check file type
//       if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
//         setError('Only image and video files are allowed');
//         return;
//       }
      
//       // Check file size (100MB limit)
//       if (selectedFile.size > 100 * 1024 * 1024) {
//         setError('File size must be less than 100MB');
//         return;
//       }
      
//       setFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!file) {
//       setError('Please select a file');
//       return;
//     }

//     setUploading(true);
//     setError('');

//     try {
//       const uploadData = new FormData();
//       uploadData.append('file', file);
      
//       if (formData.password) {
//         uploadData.append('password', formData.password);
//       }
//       if (formData.expirationHours) {
//         uploadData.append('expirationHours', formData.expirationHours);
//       }
//       if (formData.viewLimit) {
//         uploadData.append('viewLimit', formData.viewLimit);
//       }

//       const response = await fileAPI.upload(uploadData);
      
//       setShareLink(response.data.shareLink);
//       onFileUploaded(response.data.file);
      
//       // Reset form
//       setFile(null);
//       setFormData({
//         password: '',
//         expirationHours: '',
//         viewLimit: '',
//       });
      
//       // Reset file input
//       const fileInput = document.getElementById('file-input');
//       if (fileInput) fileInput.value = '';
      
//     } catch (error) {
//       setError(error.response?.data?.message || 'Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const copyShareLink = () => {
//     const fullLink = `${window.location.origin}/view/${shareLink}`;
//     navigator.clipboard.writeText(fullLink);
//     alert('Share link copied to clipboard!');
//   };

//   return (
//     <div className="file-upload">
//       <h3>Upload File</h3>
      
//       {error && <div className="error-message">{error}</div>}
      
//       {shareLink && (
//         <div className="share-link-container">
//           <h4>File uploaded successfully!</h4>
//           <div className="share-link">
//             <input 
//               type="text" 
//               value={`${window.location.origin}/view/${shareLink}`}
//               readOnly 
//             />
//             <button onClick={copyShareLink} className="btn btn-secondary">
//               Copy Link
//             </button>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="upload-form">
//         <div className="form-group">
//           <label htmlFor="file-input">Select File (Image or Video)</label>
//           <input
//             type="file"
//             id="file-input"
//             accept="image/*,video/*"
//             onChange={handleFileChange}
//             required
//           />
//           {file && (
//             <div className="file-info">
//               Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//             </div>
//           )}
//         </div>

//         <div className="form-group">
//           <label htmlFor="password">Password (Optional)</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             placeholder="Leave empty for no password protection"
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="expirationHours">Expiration (Hours)</label>
//             <input
//               type="number"
//               id="expirationHours"
//               name="expirationHours"
//               value={formData.expirationHours}
//               onChange={handleInputChange}
//               placeholder="Leave empty for no expiration"
//               min="1"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="viewLimit">View Limit</label>
//             <input
//               type="number"
//               id="viewLimit"
//               name="viewLimit"
//               value={formData.viewLimit}
//               onChange={handleInputChange}
//               placeholder="Leave empty for unlimited views"
//               min="1"
//             />
//           </div>
//         </div>

//         <button type="submit" className="btn btn-primary" disabled={uploading}>
//           {uploading ? 'Uploading...' : 'Upload File'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default FileUpload;
