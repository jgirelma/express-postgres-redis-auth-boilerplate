import Joi from "@hapi/joi";

const email = Joi.string().email().min(4).max(254).lowercase().trim().required()
const password = Joi.string().min(3).max(72).required()
const passwordConfirmation = Joi.ref("password")
const firstname = Joi.string().min(3).max(128).trim().required()
const lastname = Joi.string().min(3).max(128).trim().required()

export const userSchema = Joi.object({
  firstname,
  lastname,
  password,
  passwordConfirmation,
  email
})

export const loginSchema = Joi.object({
  email,
  password,
})