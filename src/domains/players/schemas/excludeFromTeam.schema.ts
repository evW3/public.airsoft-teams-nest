import * as Joi from 'joi';

export const ExcludeFromTeam = Joi.object({
    id: Joi.number().required(),

    userId: Joi.number().required(),
})