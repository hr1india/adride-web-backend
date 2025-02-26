const Joi = require('joi');

const userValidation = {
  updateUser: Joi.object({
    name: Joi.string().min(3).max(50).optional().messages({
      'string.base': 'Name must be a string.',
      'string.min': 'Name must be at least 3 characters long.',
      'string.max': 'Name cannot exceed 50 characters.',
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address.',
    }),
    role: Joi.string().valid('user', 'admin').optional().messages({
      'any.only': 'Role must be either user or admin.',
    }),
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().required().messages({
      'string.empty': 'Old password is required.',
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long.',
      'string.empty': 'New password is required.',
    }),
  }),
};

module.exports = userValidation;