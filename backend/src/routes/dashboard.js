const express = require('express');
const File = require('../models/File');
const ActivityLog = require('../models/ActivityLog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get storage analytics
router.get('/storage', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId });
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const fileCount = files.length;

    const maxStorage = parseInt(process.env.MAX_FILE_SIZE) * 10 || 100 * 1024 * 1024;

    res.json({
      totalSize,
      maxStorage,
      usedPercentage: ((totalSize / maxStorage) * 100).toFixed(2),
      fileCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get activity logs
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.userId })
      .populate('fileId', 'filename')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
