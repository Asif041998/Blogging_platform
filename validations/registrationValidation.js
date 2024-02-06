const Joi = require('joi');

const registrationValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30)
            .trim()
            .regex(/^[A-Za-z\s\-.,''""']+$/)
            .messages({
                "string.base": "Username must be a string",
                "string.pattern.base":
                    "Username can only contain alphabets",
                "string.empty": "Please enter the username",
            }).required(),
        password: Joi.string().trim()
            .min(8)
            .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=]).*$/)
            .message('Password must be 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
            .messages({
                "string.empty": "Please enter the Password",
            })
            .required(),
        role: Joi.string().valid('admin', 'user').required()
    });

    return schema.validate(data);
};

module.exports = registrationValidation;
