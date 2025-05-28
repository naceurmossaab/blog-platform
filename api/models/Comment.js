const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // null = commentaire racine
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
