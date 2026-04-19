import { useState, useCallback } from 'react';
import { fileAPI } from '../services/api';
import toast from 'react-hot-toast';

const FileList = ({ files = [], onFileDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);

  // ===============================
  // 🗑️ Delete File
  // ===============================
  const handleDelete = useCallback(async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      setDeletingId(fileId);

      await fileAPI.deleteFile(fileId);
      onFileDeleted(fileId);

      toast.success('File deleted 🗑️');
    } catch (error) {
      console.error(error);
      toast.error('Delete failed ❌');
    } finally {
      setDeletingId(null);
    }
  }, [onFileDeleted]);

  // ===============================
  // 🔗 Copy Link
  // ===============================
  const copyShareLink = useCallback((file) => {
    console.log("FILE CLICKED:", file); // 🔥 DEBUG

    if (!file?.shareLink) {
      console.error("❌ shareLink missing:", file);
      toast.error('Invalid file link ❌');
      return;
    }

    const fullLink = `${window.location.origin}/view/${file.shareLink}`;
    navigator.clipboard.writeText(fullLink);

    toast.success('Link copied 📋');
  }, []);

  // ===============================
  // 🧾 Helpers
  // ===============================
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString();

  // ===============================
  // ❌ Empty State
  // ===============================
  if (!Array.isArray(files) || files.length === 0) {
    return (
      <div className="no-files">
        <p>No files uploaded yet.</p>
      </div>
    );
  }

  // ===============================
  // 📦 File List
  // ===============================
  return (
    <div className="file-list">
      {files.map((file) => (
        <div key={file._id} className="file-item">

          {/* File Info */}
          <div className="file-info">
            <h4>{file.originalFilename}</h4>

            <div className="file-details">
              <span>{file.fileType}</span>
              <span>{formatFileSize(file.fileSize)}</span>
              <span>{formatDate(file.createdAt)}</span>
            </div>

            <div className="file-settings">
              {file.isPasswordProtect && <span>🔒 Protected</span>}
              {file.expirationDate && (
                <span>⏰ Expires: {formatDate(file.expirationDate)}</span>
              )}
              {file.viewLimit && (
                <span>👁 {file.currentView}/{file.viewLimit}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="file-actions">
            <button
              onClick={() => copyShareLink(file)}
              className="btn btn-secondary"
            >
              Copy Link
            </button>

            <button
              onClick={() => handleDelete(file._id)}
              className="btn btn-danger"
              disabled={deletingId === file._id}
            >
              {deletingId === file._id ? 'Deleting...' : 'Delete'}
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default FileList;



// import { useState, useCallback, memo } from 'react';
// import { fileAPI } from '../services/api';
// import toast from 'react-hot-toast'
// //  Memoized File Item (prevents unnecessary re-renders)
// const FileItem = memo(({ file, onDelete, deletingId, onCopy }) => {
//   return (
//     <div className="file-item">
//       <div className="file-info">
//         <h4>{file.originalFilename}</h4>

//         <div className="file-details">
//           <span>{file.fileType}</span>
//           <span>{formatFileSize(file.fileSize)}</span>
//           <span>Uploaded: {formatDate(file.createdAt)}</span>
//         </div>

//         <div className="file-settings">
//           {file.isPasswordProtect && (
//             <span className="setting-badge">🔒 Protected</span>
//           )}
//           {file.expirationDate && (
//             <span className="setting-badge">
//               ⏰ {formatDate(file.expirationDate)}
//             </span>
//           )}
//           {file.viewLimit && (
//             <span className="setting-badge">
//               👁️ {file.currentView}/{file.viewLimit}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="file-actions">
//         <button onClick={() => onCopy(file.shareLink)} className="btn btn-secondary">
//           Copy Link
//         </button>

//         <button
//           onClick={() => onDelete(file._id)}
//           className="btn btn-danger"
//           disabled={deletingId === file._id}
//         >
//           {deletingId === file._id ? 'Deleting...' : 'Delete'}
//         </button>
//       </div>
//     </div>
//   );
// });

// // ===============================
// // Utility functions (outside component = no re-creation)
// // ===============================
// const formatFileSize = (bytes) => {
//   if (!bytes) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['B', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
// };

// const formatDate = (date) =>
//   new Date(date).toLocaleString();

// // ===============================
// //  Main Component
// // ===============================
// const FileList = ({ files = [], onFileDeleted }) => {
//   const [deletingId, setDeletingId] = useState(null);

//   //  useCallback prevents re-creation
//   const handleDelete = useCallback(async (fileId) => {
//     const confirmDelete = window.confirm('Delete this file?');
//     if (!confirmDelete) return;

//     setDeletingId(fileId);

//     try {
//       await fileAPI.deleteFile(fileId);
//       onFileDeleted(fileId);
//     } catch (err) {
//       console.error(err);
//       toast('Delete failed ❌'); 
//     } finally {
//       setDeletingId(null);
//     }
//   }, [onFileDeleted]);

//   const copyShareLink = useCallback(async (shareLink) => {
//     try {
//       const link = `${window.location.origin}/view/${shareLink}`;
//       await navigator.clipboard.writeText(link);
//       toast('Link copied ');
//     } catch {
//       toast('Copy failed ');
//     }
//   }, []);

//   if (!files.length) {
//     return (
//       <div className="no-files">
//         <p>No files yet. Upload something 🚀</p>
//       </div>
//     );
//   }

//   return (
//     <div className="file-list">
//       {files.map((file) => (
//         <FileItem
//           key={file._id}
//           file={file}
//           deletingId={deletingId}
//           onDelete={handleDelete}
//           onCopy={copyShareLink}
//         />
//       ))}
//     </div>
//   );
// };

// export default FileList;
















// // import { useState } from 'react';
// // import { fileAPI } from '../services/api';

// // const FileList = ({ files, onFileDeleted, onRefresh }) => {
// //   const [deletingId, setDeletingId] = useState(null);

// //   // Ensure files is always an array
// //   const safeFiles = Array.isArray(files) ? files : [];

// //   const handleDelete = async (fileId) => {
// //     if (!window.confirm('Are you sure you want to delete this file?')) {
// //       return;
// //     }

// //     setDeletingId(fileId);
// //     try {
// //       await fileAPI.deleteFile(fileId);
// //       onFileDeleted(fileId);
// //     } catch (error) {
// //       alert('Failed to delete file');
// //       console.error('Delete error:', error);
// //     } finally {
// //       setDeletingId(null);
// //     }
// //   };

// //   const copyShareLink = (shareLink) => {
// //     const fullLink = `${window.location.origin}/view/${shareLink}`;
// //     navigator.clipboard.writeText(fullLink);
// //     alert('Share link copied to clipboard!');
// //   };

// //   const formatFileSize = (bytes) => {
// //     if (bytes === 0) return '0 Bytes';
// //     const k = 1024;
// //     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// //     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// //   };

// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleString();
// //   };

// //   if (safeFiles.length === 0) {
// //     return (
// //       <div className="no-files">
// //         <p>No files uploaded yet. Upload your first file above!</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="file-list">
// //       {safeFiles.map((file) => (
// //         <div key={file._id} className="file-item">
// //           <div className="file-info">
// //             <h4>{file.originalFilename}</h4>
// //             <div className="file-details">
// //               <span className="file-type">{file.fileType}</span>
// //               <span className="file-size">{formatFileSize(file.fileSize)}</span>
// //               <span className="file-date">Uploaded: {formatDate(file.createdAt)}</span>
// //             </div>
            
// //             <div className="file-settings">
// //               {file.isPasswordProtect && (
// //                 <span className="setting-badge">🔒 Password Protected</span>
// //               )}
// //               {file.expirationDate && (
// //                 <span className="setting-badge">
// //                   ⏰ Expires: {formatDate(file.expirationDate)}
// //                 </span>
// //               )}
// //               {file.viewLimit && (
// //                 <span className="setting-badge">
// //                   👁️ Views: {file.currentView}/{file.viewLimit}
// //                 </span>
// //               )}
// //             </div>
// //           </div>

// //           <div className="file-actions">
// //             <button
// //               onClick={() => copyShareLink(file.shareLink)}
// //               className="btn btn-secondary"
// //             >
// //               Copy Link
// //             </button>
// //             <button
// //               onClick={() => handleDelete(file._id)}
// //               className="btn btn-danger"
// //               disabled={deletingId === file._id}
// //             >
// //               {deletingId === file._id ? 'Deleting...' : 'Delete'}
// //             </button>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default FileList;
