import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),  
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),  
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),  
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),  
  role: Joi.string().valid('wallOwner', 'Autowala/HelmetWala', 'admin', 'advertiser').default('wallOwner') 
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
