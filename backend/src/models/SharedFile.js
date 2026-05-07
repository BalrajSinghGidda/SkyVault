const mongoose = require('mongoose');

const sharedFileSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: true,
    },
    sharedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permission: {
      type: String,
      enum: ['view', 'download', 'edit'],
      default: 'view',
    },
    linkToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    expiresAt: {
      type: Date,
      sparse: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SharedFile', sharedFileSchema);
