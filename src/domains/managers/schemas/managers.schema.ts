import * as Joi from 'joi';

export const ManagersSchema = Joi.object({
    id: Joi.number().required(),

    managerId: Joi.number().required(),

    description: Joi.string().required()
});