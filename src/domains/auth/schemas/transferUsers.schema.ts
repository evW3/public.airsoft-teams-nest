import * as Joi from 'joi';

export const UsersSchema = Joi.object({

    password: Joi.string().required(),

    repeatPassword: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})