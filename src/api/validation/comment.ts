import Joi from "@hapi/joi";

const post_id = Joi.number().required()
const body = Joi.string().min(1).required()
const parent_id = Joi.number()

export const commentSchema = Joi.object({
  post_id,
  body,
  parent_id
})

export const deleteCommentSchema = Joi.object({
  id: Joi.number().required(),
})

export const voteCommentSchema = Joi.object({
  comment_id: Joi.number().required(),
})