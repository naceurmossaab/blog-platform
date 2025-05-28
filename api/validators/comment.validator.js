const Joi = require('joi');

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required().messages({
    'string.empty': 'Comment content is required',
    'string.min': 'Comment is too short',
    'string.max': 'Comment is too long',
  }),
  parent: Joi.string().optional().pattern(/^[a-f\d]{24}$/i).messages({
    'string.pattern.base': 'Parent ID must be a valid Mongo ObjectId',
  }),
});

module.exports = {
  createCommentSchema,
};
