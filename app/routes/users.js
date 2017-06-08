'use strict';

const Boom = require('boom');
const mongojs = require('mongojs');

const { Joi } = require('../utils');


const userSchema = Joi.object({
	_id: Joi.any(),
	name: Joi.string().max(255).required(),
	email: Joi.string().email(),
	personalId: Joi.string().personalId().required(),
	address: Joi.object({
		street: Joi.string(),
		number: Joi.string(),
		postal: Joi.number(),
		city: Joi.string(),
		country: Joi.string().min(2).max(3),
	}).optional().meta({ className: 'Address' }),
}).meta({ className: 'User' });

exports.register = function(server, options, next) {
	const db = server.app.db;

	server.route({
		method: 'GET',
		path: '/',
		handler: function (request, reply) {
			db.users.find(function(err, docs) {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(docs);
			});
		},
		config: {
			description: 'Lists all users',
			response: {
				schema: Joi.array().items(userSchema),
			},
			tags: ['api', 'users'],
		},
	});

	server.route({
		method: 'GET',
		path: '/{id}',
		handler: function (request, reply) {
			db.users.findOne({
				_id: mongojs.ObjectID(request.params.id)
			}, (err, doc) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (!doc) {
					return reply(Boom.notFound());
				}

				reply(doc);
			});
		},
		config: {
			description: 'Fetch a user',
			response: {
				schema: userSchema,
			},
			tags: ['api'],
			validate: {
				params: {
					id: Joi.string().required(),
				},
			},
		},
	});

	server.route({
		method: 'POST',
		path: '/',
		handler: function (request, reply) {
			const user = request.payload;

			//Create an id
			user._id = mongojs.ObjectID();

			db.users.save(user, (err, result) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(user);
			});
		},
		config: {
			description: 'Create new users',
			tags: ['api'],
			validate: {
				payload: userSchema,
			},
		},
	});

	server.route({
		method: 'PATCH',
		path: '/{id}',
		handler: function (request, reply) {
			db.users.update({
				_id: mongojs.ObjectId(request.params.id)
			}, {
				$set: request.payload
			}, function (err, result) {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (result.n === 0) {
					return reply(Boom.notFound());
				}

				reply().code(204);
			});
		},
		config: {
			description: 'Update a user',
			tags: ['api'],
			validate: {
				params: {
					id: Joi.string().required(),
				},
				payload: Joi.object({
					name: Joi.string(),
					email: Joi.string().email(),
					address: Joi.object({
						street: Joi.string(),
						number: Joi.string(),
						postal: Joi.number(),
						city: Joi.string(),
						country: Joi.string().min(2).max(3),
					}),
				}).required().min(1),
			},
		},
	});

	server.route({
		method: 'DELETE',
		path: '/{id}',
		handler: function (request, reply) {
			console.log(Joi.validate(request.params.id, Joi.string()));
			db.users.remove({
				_id: mongojs.ObjectID(request.params.id)
			}, function (err, result) {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				if (result.n === 0) {
					return reply(Boom.notFound());
				}

				reply().code(204);
			});
		},
		config: {
			description: 'Deletes a user',
			tags: ['api'],
			validate: {
				params: {
					id: Joi.string().required(),
				},
			},
		},
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-users'
};
