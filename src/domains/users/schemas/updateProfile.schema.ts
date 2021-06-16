import * as Joi from 'joi';

export const UpdateProfileSchema = Joi.object({
    id: Joi.number().required(),

    newPassword: Joi.string(),

    currentPassword: Joi.string(),

    login: Joi.string(),
})