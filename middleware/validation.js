const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateMusicCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).message({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    albumUrl: Joi.string().required().custom(validateURL).message({
      "string.empty": 'The "albumUrl" field must be filled in',
      "string.url": 'The "albumUrl" field must be a valid url',
    }),
    artist: Joi.string().required().min(2).max(30).message({
      "string.min": 'The minimum length of the "artist" field is 2',
      "string.max": 'The maximum length of the "artist" field is 30',
      "string.empty": 'The "artist" field must be filled in',
    }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "username" field is 2',
      "string.max": 'The maximum length of the "username" field is 30',
      "string.empty": 'The "username" field must be filled in',
    }),
    email: Joi.string().required().email().message({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().min(8).message({
      "string.empty": 'The "password" field must be filled in',
      "string.min": 'The minimum length of the "password" field is 8',
    }),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().min(24).messages({
      "string.length":
        'The "itemId" field must be a 24 character hexadecimal string',
      "string.empty": 'The "itemId" field must be filled in',
    }),
  }),
});

module.exports = {
  validateMusicCard,
  validateUserInfo,
  validateItemId,
};
