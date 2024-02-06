const Joi = require("joi");

const blogPostValidations = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).trim()
            .regex(/^(?=.*[a-zA-Z])[\w\d!@#$%^&*()-+=,.?/\\;:'"<>\[\]{}|_~`]/)
            .messages({
                "string.base": "Title must be a string",
                "string.pattern.base": "Title can only contain a combination of alphabets, numbers, and special characters",
            }),
        content: Joi.string()
            .min(3)
            .trim()
            .regex(/^(?=.*[a-zA-Z])[\w\d!@#$%^&*()-+=,.?/\\;:'"<>\[\]{}|_~`]/)
            .messages({
                "string.base": "Content must be a string",
                "string.pattern.base":
                    "Content can only contain a combination of alphabets, numbers, and special characters",
            }),
        author: Joi.string().trim()
    });

    return schema.validate(data);
};

module.exports = blogPostValidations;
