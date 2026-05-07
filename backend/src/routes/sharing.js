const express = require('express');
const crypto = require('crypto');
const File = require('../models/File');
const SharedFile = require('../models/SharedFile');
const ActivityLog = require('../models/ActivityLog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Share file with user
router.post('/:fileId', authMiddleware, async (req, res) => {
  try {
    const { sharedWith, permission } = req.body;

    const file = await File.findOne({ _id: req.params.fileId, userId: req.userId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const sharedFile = new SharedFile({
      fileId: file._id,
      sharedWith,
      permission: permission || 'view',
    });

    await sharedFile.save();

    // Log activity
    await ActivityLog.create({
      userId: req.userId,
      action: 'share',
      fileId: file._id,
      details: `Shared file: ${file.filename}`,
    });

    res.status(201).json({ message: 'File shared successfully', shareId: sharedFile._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate temporary link
router.post('/:fileId/link', authMiddleware, async (req, res) => {
  try {
    const { expiresIn = 7 } = req.body; // days

    const file = await File.findOne({ _id: req.params.fileId, userId: req.userId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const linkToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);

    const sharedFile = new SharedFile({
      fileId: file._id,
      linkToken,
      expiresAt,
      permission: 'download',
    });

    await sharedFile.save();

    res.status(201).json({
      message: 'Share link generated',
      link: `/api/share/download/${linkToken}`,
      expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download via share link (public)
router.get('/download/:token', async (req, res) => {
  try {
    const sharedFile = await SharedFile.findOne({
      linkToken: req.params.token,
      expiresAt: { $gt: new Date() },
    }).populate('fileId');

    if (!sharedFile) {
      return res.status(404).json({ error: 'Link expired or not found' });
    }

    const file = sharedFile.fileId;
    res.download(file.filepath, file.filename);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
