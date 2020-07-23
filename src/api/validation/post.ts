import Joi from "@hapi/joi";

const title = Joi.string().min(1).required()
const body = Joi.string().min(1).required();

export const postSchema = Joi.object({
  title,
  body,
})

export const deletePostSchema = Joi.object({
  post_id: Joi.number().required()
})

export const votePostSchema = Joi.object({
  post_id: Joi.number().required()
})