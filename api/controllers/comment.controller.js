const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');


const createComment = async (req, res) => {
  const { content, parent } = req.body;
  const { articleId } = req.params;

  const article = await Article.findById(articleId);
  if (!article) {
    throw new CustomError.NotFoundError('Article not found');
  }

  const newComment = await Comment.create({
    content,
    author: req.user.userId,
    article: articleId,
    parent: parent || null
  });

  const authorId = article.author._id.toString();
  // if (authorId !== req.user.userId) {
  // Get io instance
  const io = req.app.get('io');
  if (!io) console.error('fuckkkkkk => Socket.io not initialized');

  io.sendNotificationToUser(authorId, {
    type: 'comment',
    title: 'Nouveau commentaire',
    message: `Un nouveau commentaire a été ajouté sur votre article "${article.title}"`,
    articleId,
  });
  // }
  res.status(StatusCodes.CREATED).json({ comment: newComment });
};

const getCommentsByArticle = async (req, res) => {
  const { articleId } = req.params;

  const comments = await Comment.find({ article: articleId })
    .populate('author', 'name email')
    .lean();

  const commentMap = {};
  comments.forEach(c => {
    c.children = [];
    commentMap[c._id] = c;
  });

  const rootComments = [];
  comments.forEach(c => {
    if (c.parent) {
      commentMap[c.parent]?.children.push(c);
    } else {
      rootComments.push(c);
    }
  });

  res.status(StatusCodes.OK).json({ comments: rootComments });
};

const deleteComment = async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new CustomError.NotFoundError('Comment not found');
  }

  if (
    comment.author.toString() !== req.user.userId &&
    req.user.role !== 'admin'
  ) {
    throw new CustomError.UnauthorizedError('Unauthorized to delete this comment');
  }

  await Comment.findByIdAndDelete(id);
  res.status(200).json({ message: 'Comment deleted' });
};

module.exports = {
  createComment,
  getCommentsByArticle,
  deleteComment
};
