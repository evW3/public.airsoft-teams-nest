import * as Joi from 'joi';

export const SendRecoverTokenSchema = Joi.object({
    email: Joi.string().required(),

    id: Joi.number().required()
})