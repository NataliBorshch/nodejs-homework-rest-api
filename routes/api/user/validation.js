const Joi = require("joi");

const schemaCreateUser = Joi.object({
  name: Joi.string().min(2).max(40).required(),
  lastName: Joi.string().min(2).max(40).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  password: Joi.string().required(),
  token: Joi.string(),
  subscription: Joi.string().required(),
});

const schemaUpdateUser = Joi.object({
  name: Joi.string().alphanum().min(3).max(40).optional(),
  lastName: Joi.string().alphanum().min(3).max(40).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  password: Joi.string().optional(),
  token: Joi.string().optional(),
  subscription: Joi.string().optional(),
}).min(1);

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string().required,
}).or("subscription");

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

module.exports = {
  validationCreateUser: (req, res, next) => {
    return validate(schemaCreateUser, req.body, next);
  },
  validationUpdateUser: (req, res, next) => {
    return validate(schemaUpdateUser, req.body, next);
  },
  validationUpdateSubscription: (req, res, next) => {
    return validate(schemaUpdateSubscription, req.body, next);
  },
};
