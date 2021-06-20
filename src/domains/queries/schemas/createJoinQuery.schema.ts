import * as Joi from 'joi';

export const CreateJoinQuerySchema = Joi.object({
    id: Joi.number().required(),

    teamId: Joi.number().required()
});