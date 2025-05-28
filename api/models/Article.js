const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide title'],
      minlength: 3,
      maxlength: 100,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
      minlength: 10,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', ArticleSchema);
