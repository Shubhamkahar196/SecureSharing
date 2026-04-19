
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises'); // ✅ async fs
const bcrypt = require('bcryptjs');
const File = require('../models/File');

// small helper to avoid repetition
const isExpired = (file) =>
  file.expirationDate && Date.now() > new Date(file.expirationDate).getTime();

const isViewLimitExceeded = (file) =>
  file.viewLimit && file.currentView >= file.viewLimit;

// ==========================================
// Get File Info (public metadata)
// ==========================================
const getFileInfo = async (req, res) => {
  try {
    const { shareLink } = req.params;

    //  lean() for faster read, exclude password
    const file = await File.findOne({ shareLink })
      .select('-filePassword')
      .lean();

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (isExpired(file)) {
      return res.status(410).json({ message: 'File has expired' });
    }

    if (isViewLimitExceeded(file)) {
      return res.status(410).json({ message: 'View limit exceeded' });
    }

    res.status(200).json({
      shareLink: file.shareLink,
      originalFilename: file.originalFilename,
      fileType: file.fileType,
      fileSize: file.fileSize,
      isPasswordProtect: file.isPasswordProtect,
      expirationDate: file.expirationDate,
      viewLimit: file.viewLimit,
      currentView: file.currentView,
      createdAt: file.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Access / Stream File
// ==========================================
const accessFile = async (req, res) => {
  try {
    const { shareLink } = req.params;
    const { password } = req.body;

    // get full doc (need password + update)
    let file = await File.findOne({ shareLink });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (isExpired(file)) {
      return res.status(410).json({ message: 'File has expired' });
    }

    if (isViewLimitExceeded(file)) {
      return res.status(410).json({ message: 'View limit exceeded' });
    }

    //  Password check (hashed)
    if (file.isPasswordProtect) {
      if (!password) {
        return res.status(401).json({ message: 'Password required' });
      }

      const ok = await bcrypt.compare(password, file.filePassword);
      if (!ok) {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }

    //  ATOMIC increment (prevents race conditions)
    file = await File.findOneAndUpdate(
      {
        _id: file._id,
        // ensure still valid at update-time
        $or: [
          { viewLimit: null },
          { $expr: { $lt: ['$currentView', '$viewLimit'] } },
        ],
      },
      { $inc: { currentView: 1 } },
      { new: true }
    );

    if (!file) {
      return res.status(410).json({ message: 'View limit exceeded' });
    }

    const filePath = path.join(__dirname, '../uploads', file.storedFileName);

    // async existence check
    try {
      await fsp.access(filePath);
    } catch {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // 🔒 safer headers
    res.setHeader('Content-Type', file.fileType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(file.originalFilename)}"`
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // 📡 stream with error handling
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      return res.status(500).end();
    });

    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFileInfo,
  accessFile,
};




// const path = require('path');
// const fs = require('fs');
// const fsp = require('fs/promises'); 
// const bcrypt = require('bcryptjs');
// const File = require('../models/File');


// const isExpired = (file) =>
//   file.expirationDate && Date.now() > new Date(file.expirationDate).getTime();

// const isViewLimitExceeded = (file) =>
//   file.viewLimit && file.currentView >= file.viewLimit;


// const getFileInfo = async (req, res) => {
//   try {
//     const { shareLink } = req.params;

//     const file = await File.findOne({ shareLink }).select('-filePassword').lean();

//     if (!file) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     const isExpired = (file) =>
//   file.expirationDate && Date.now() > new Date(file.expirationDate).getTime();

// const isViewLimitExceeded = (file) =>
//   file.viewLimit && file.currentView >= file.viewLimit;

//     res.json({
//        originalFilename: file.originalFilename,
//       fileType: file.fileType,
//       fileSize: file.fileSize,
//       isPasswordProtect: file.isPasswordProtect,
//       expirationDate: file.expirationDate,
//       viewLimit: file.viewLimit,
//       currentView: file.currentView,
//       createdAt: file.createdAt,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// const accessFile = async (req, res) => {
//   try {
//     const { shareLink } = req.params;
//     const { password } = req.body;

//     const file = await File.findOne({ shareLink });

//     if (!file) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     // Check if file has expired
//     if (file.expirationDate && new Date() > file.expirationDate) {
//       return res.status(410).json({ message: 'File has expired' });
//     }

//     // Check view limit
//     if (file.viewLimit && file.currentView >= file.viewLimit) {
//       return res.status(410).json({ message: 'View limit exceeded' });
//     }

//     // Check password if required
//     if (file.isPasswordProtect) {
//       if (!password) {
//         return res.status(401).json({ message: 'Password required' });
//       }

//       const isPasswordValid = await bcrypt.compare(password, file.filePassword);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid password' });
//       }
//     }

//     // Increment view count
//     file.currentView += 1;
//     await file.save();

//     // Serve the file
//     const filePath = path.join(__dirname, '../uploads', file.storedFileName);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: 'File not found on server' });
//     }

//     // Set appropriate headers
//     res.setHeader('Content-Type', file.fileType);
//     res.setHeader('Content-Disposition', `inline; filename="${file.originalFilename}"`);

//     // Stream the file
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getFileInfo,
//   accessFile,
// };
