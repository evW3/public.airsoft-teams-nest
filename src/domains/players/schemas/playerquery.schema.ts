import * as Joi from 'joi';

export const PlayerQuerySchema = Joi.object({
    id: Joi.number().required(),

    queryId: Joi.number().required(),
})