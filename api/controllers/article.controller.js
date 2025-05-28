const Article = require('../models/Article');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createArticle = async (req, res) => {
  const { title, content, tags, published } = req.body;
  const author = req.user.userId;

  const article = await Article.create({ title, content, tags, published, author });
  res.status(StatusCodes.CREATED).json({ article });
};

const getAllArticles = async (req, res) => {
  const articles = await Article.find().populate('author', 'name email');
  res.status(StatusCodes.OK).json({ articles });
};

const getSingleArticle = async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id).populate('author', 'name email');

  if (!article) {
    throw new CustomError.NotFoundError('Article not found');
  }
  
  res.status(StatusCodes.OK).json({ article });
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const article = await Article.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!article) {
    throw new CustomError.NotFoundError('Article not found');
  }
  
  res.status(StatusCodes.OK).json({ article });
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const article = await Article.findByIdAndDelete(id);
  
  if (!article) {
    throw new CustomError.NotFoundError('Article not found');
  }

  res.status(StatusCodes.OK).json({ message: 'Article deleted successfully' });
};

module.exports = {
  createArticle,
  getAllArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
};
