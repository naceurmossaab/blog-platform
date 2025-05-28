const express = require('express');
const router = express.Router();

const {
  createArticle,
  getAllArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/article.controller');

const { authenticateUser } = require('../middleware/authentication');
const validate = require('../middleware/validationMiddleware');
const {
  createArticleSchema,
  updateArticleSchema,
} = require('../validators/article.validator');

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management
 */

/**
 * @swagger
 * /api/v1/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Understanding Express Middleware"
 *               content:
 *                 type: string
 *                 example: "This article explains how Express middleware works..."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["express", "nodejs"]
 *               published:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Article created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateUser, validate(createArticleSchema), createArticle);

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all articles
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateUser, getAllArticles);

/**
 * @swagger
 * /api/v1/articles/{id}:
 *   get:
 *     summary: Get a single article by ID
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Article found
 *       404:
 *         description: Article not found
 */
router.get('/:id', authenticateUser, getSingleArticle);

/**
 * @swagger
 * /api/v1/articles/{id}:
 *   patch:
 *     summary: Update an article by ID
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated title"
 *               content:
 *                 type: string
 *                 example: "Updated content"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["update"]
 *               published:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Article updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Article not found
 */
router.patch('/:id', authenticateUser, validate(updateArticleSchema), updateArticle);

/**
 * @swagger
 * /api/v1/articles/{id}:
 *   delete:
 *     summary: Delete an article by ID
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Article deleted
 *       404:
 *         description: Article not found
 */
router.delete('/:id', authenticateUser, deleteArticle);

module.exports = router;
