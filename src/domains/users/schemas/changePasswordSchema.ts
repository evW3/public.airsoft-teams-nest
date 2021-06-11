import * as Joi from 'joi';

export const ChangePasswordSchema = Joi.object({

    password: Joi.string().required(),

    repeatPassword: Joi.ref('password'),

    id: Joi.number().required(),

    codeId: Joi.number().required(),
})