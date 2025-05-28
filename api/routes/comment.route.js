const express = require('express');
const router = express.Router();

const {
  createComment,
  getCommentsByArticle,
  deleteComment,
} = require('../controllers/comment.controller');

const { authenticateUser } = require('../middleware/authentication');
const validate = require('../middleware/validationMiddleware');
const { createCommentSchema } = require('../validators/comment.validator');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment system with replies
 */

/**
 * @swagger
 * /api/v1/comments/{articleId}:
 *   post:
 *     summary: Post a comment or reply to a comment on an article
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: ID of the article
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Great article!"
 *               parent:
 *                 type: string
 *                 description: Optional parent comment ID (for replies)
 *                 example: "6653ff4f15b4e123abc45678"
 *     responses:
 *       201:
 *         description: Comment posted
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Article not found
 */
router.post('/:articleId', authenticateUser, validate(createCommentSchema), createComment);

/**
 * @swagger
 * /api/v1/comments/{articleId}:
 *   get:
 *     summary: Get all comments (nested) for an article
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: ID of the article
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of nested comments
 *       404:
 *         description: Article not found
 */
router.get('/:articleId', authenticateUser, getCommentsByArticle);

/**
 * @swagger
 * /api/v1/comments/delete/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.delete('/delete/:id', authenticateUser, deleteComment);

module.exports = router;
