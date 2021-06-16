import * as Joi from 'joi';

export const CreateTeamSchema = Joi.object({
    id: Joi.number().required(),

    name: Joi.string().required()
});