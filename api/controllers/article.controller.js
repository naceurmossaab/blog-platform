const Article = require('../models/Article');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');
const fs = require('fs');

const createArticle = async (req, res) => {
  const { title, content, tags, published } = req.body;
  const author = req.user.userId;

  let imagePath = '';

  if (req.files && req.files.image) {
    const imageFile = req.files.image;
    const cleanName = imageFile.name.replace(/\s+/g, '-');
    const filename = Date.now() + '-' + cleanName;

    if (!imageFile.mimetype.startsWith('image'))
      return res.status(400).json({ message: 'Le fichier doit être une image.' });
    if (imageFile.size > 5 * 1024 * 1024)
      return res.status(400).json({ message: 'Image trop volumineuse (max 5 Mo).' });

    const uploadPath = path.join(__dirname, '../public/uploads', filename);
    await imageFile.mv(uploadPath);
    imagePath = `/uploads/${filename}`;
  }

  const article = await Article.create({
    title,
    content,
    tags,
    published,
    author,
    image: imagePath,
  });

  res.status(201).json({ article });
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
  let updatedData = { ...req.body };

  if (req.files && req.files.image) {
    const imageFile = req.files.image;
    const cleanName = imageFile.name.replace(/\s+/g, '-');
    const filename = Date.now() + '-' + cleanName;

    if (!imageFile.mimetype.startsWith('image'))
      return res.status(400).json({ message: 'Le fichier doit être une image.' });

    if (imageFile.size > 5 * 1024 * 1024)
      return res.status(400).json({ message: 'Image trop volumineuse (max 5 Mo).' });

    const uploadPath = path.join(__dirname, '../public/uploads', filename);

    await imageFile.mv(uploadPath);
    updatedData.image = `/uploads/${filename}`;
  }

  const article = await Article.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!article) throw new CustomError.NotFoundError('Article not found');
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
