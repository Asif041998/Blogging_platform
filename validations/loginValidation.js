const Joi = require('joi');

const loginValidations = (data) => {
    const Schema = Joi.object({
        username: Joi.string().required().trim().messages({
            "string.empty": "Please enter the username",
        }),
        password: Joi.string().required().trim().messages({
            "string.empty": "Please enter the Password",
        })
    });
    return Schema.validate(data);
};

module.exports = loginValidations;