'use strict';

const Joi = require('joi');
const kennitala = require('kennitala-utility');

exports.Joi = Joi.extend(joi => ({
	base: joi.string(),
	name: 'string',
	language: {
		personalId: 'not a valid personal Id',
	},
	rules: [
		{
			name: 'personalId',
			validate(params, value, state, options) {
				if (!kennitala.isValid(value)) {
					// Generate an error, state and options need to be passed
					return this.createError('string.personalId', {}, state, options);
				}

				return value; // Everything is OK
			},
		},
	],
}));
