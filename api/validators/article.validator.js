const Joi = require('joi');

const createArticleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string()),
  published: Joi.boolean(),
});

const updateArticleSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(10),
  tags: Joi.array().items(Joi.string()),
  published: Joi.boolean(),
});

module.exports = {
  createArticleSchema,
  updateArticleSchema,
};
