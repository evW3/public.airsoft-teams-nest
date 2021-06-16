import * as Joi from 'joi';

export const CreateJoinQuerySchema = Joi.object({
    id: Joi.number().required(),

    teamName: Joi.string().required()
});