const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');

// ===============================
//  Ensure upload folder exists
// ===============================
const uploadDir = path.join(__dirname, '../uploads');

fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

// ===============================
// Multer Config
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter,
});

// ===============================
//  Generate Share Link
// ===============================
const generateShareLink = () => uuidv4();

// ===============================
//  Upload File
// ===============================
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let { password, expirationHours, viewLimit } = req.body;

    // Normalize inputs
    expirationHours = Number(expirationHours);
    viewLimit = Number(viewLimit);

    //  Expiration logic
    let expirationDate = null;
    if (expirationHours > 0) {
      expirationDate = new Date(Date.now() + expirationHours * 3600000);
    }

   

    const fileRecord = await File.create({
      user: req.user._id,
      originalFilename: req.file.originalname,
      storedFileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      shareLink: generateShareLink(),
      isPasswordProtect: !!password,
      filePassword: password || undefined, 
      expirationDate,
      viewLimit: viewLimit > 0 ? viewLimit : null,
    });


res.status(201).json({
  message: 'File uploaded successfully',
  file: {
    _id: fileRecord._id,               // ✅ FIXED
    shareLink: fileRecord.shareLink,  // ✅ FIXED
    originalFilename: fileRecord.originalFilename,
    fileType: fileRecord.fileType,
    fileSize: fileRecord.fileSize,
    isPasswordProtect: fileRecord.isPasswordProtect,
    expirationDate: fileRecord.expirationDate,
    viewLimit: fileRecord.viewLimit,
    currentView: fileRecord.currentView,
    createdAt: fileRecord.createdAt,
  },
});

    // res.status(201).json({
    //   message: 'File uploaded successfully',
    //   shareLink: fileRecord.shareLink,
    //   file: {
    //     id: fileRecord._id,
    //     originalFilename: fileRecord.originalFilename,
    //     fileType: fileRecord.fileType,
    //     fileSize: fileRecord.fileSize,
    //     isPasswordProtect: fileRecord.isPasswordProtect,
    //     expirationDate: fileRecord.expirationDate,
    //     viewLimit: fileRecord.viewLimit,
    //     createdAt: fileRecord.createdAt,
    //   },
    // });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
//  Get User Files
// ===============================
const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id })
      .select('-filePassword')
      .sort({ createdAt: -1 })
      .lean();

      console.log(files);

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
//  Delete File
// ===============================
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const filePath = path.join(uploadDir, file.storedFileName);

    try {
      await fs.unlink(filePath);
    } catch {
      // ignore if file missing
    }

    await file.deleteOne();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upload,
  uploadFile,
  getUserFiles,
  deleteFile,
};