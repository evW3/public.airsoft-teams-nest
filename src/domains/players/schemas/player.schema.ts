import * as Joi from 'joi';

export const PlayerSchema = Joi.object({
    id: Joi.number().required(),

    playerId: Joi.number().required(),

    description: Joi.string().required()
});