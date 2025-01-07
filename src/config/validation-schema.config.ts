import * as Joi from 'joi';

export const validationSchema = Joi.object({
	BASE_API_URL: Joi.string(),
});
