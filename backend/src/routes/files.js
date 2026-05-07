const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const ActivityLog = require('../models/ActivityLog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Setup file upload directory
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
});

// Upload file
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = new File({
      filename: req.file.originalname,
      userId: req.userId,
      size: req.file.size,
      mimetype: req.file.mimetype,
      filepath: req.file.path,
    });

    await file.save();
    
    // Log activity
    await ActivityLog.create({
      userId: req.userId,
      action: 'upload',
      fileId: file._id,
      details: `Uploaded file: ${file.filename}`,
    });

    res.status(201).json({ message: 'File uploaded successfully', fileId: file._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user files
router.get('/', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download file
router.get('/:id/download', authMiddleware, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.userId });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Log activity
    await ActivityLog.create({
      userId: req.userId,
      action: 'download',
      fileId: file._id,
      details: `Downloaded file: ${file.filename}`,
    });

    res.download(file.filepath, file.filename);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const file = await File.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete physical file
    if (fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }

    // Log activity
    await ActivityLog.create({
      userId: req.userId,
      action: 'delete',
      fileId: file._id,
      details: `Deleted file: ${file.filename}`,
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
