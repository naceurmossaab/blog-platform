const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/user.controller');
const validate = require('../middleware/validationMiddleware');
const { updateUserSchema, updatePasswordSchema } = require('../validators/user.validator');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User routes
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllUsers);

/**
 * @swagger
 * /api/v1/users/updateUser:
 *   patch:
 *     summary: Update user profile (name, email)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.route('/updateUser').patch(authenticateUser, validate(updateUserSchema), updateUser);

/**
 * @swagger
 * /api/v1/users/updateUserPassword:
 *   patch:
 *     summary: Update user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.route('/updateUserPassword').patch(authenticateUser, validate(updatePasswordSchema), updateUserPassword);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User info
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
