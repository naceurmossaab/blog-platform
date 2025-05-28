const Joi = require('joi');

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email()
});

const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = {
  updateUserSchema,
  updatePasswordSchema
};
