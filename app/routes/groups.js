'use strict';

const Boom = require('boom');
const mongojs = require('mongojs');

const { Joi } = require('../utils');


const groupSchema = Joi.object({
	_id: Joi.any(),
	name: Joi.string().max(255).required(),
	email: Joi.string().email().required(),
	type: Joi.string().allow(['association', 'union', 'group', 'troop']).required(),
	personalId: Joi.string().personalId().required(),
}).meta({ className: 'Group' });

exports.register = function(server, options, next) {
	const db = server.app.db;

	server.route({
		method: 'GET',
		path: '/',
		handler: function (request, reply) {
			db.groups.find(function(err, docs) {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(docs);
			});
		},
		config: {
			description: 'Lists all groups',
			response: {
				schema: Joi.array().items(groupSchema),
			},
			tags: ['api'],
		}
	});

	server.route({
		method: 'GET',
		path: '/{id}',
		handler: function (request, reply) {
			db.groups.findOne({
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
			description: 'Fetch a group',
			response: {
				schema: groupSchema,
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
			const group = request.payload;

			//Create an id
			group._id = mongojs.ObjectID();

			db.groups.save(group, (err, result) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(group);
			});
		},
		config: {
			description: 'Creates a new group',
			tags: ['api'],
			validate: {
				payload: groupSchema,
			}
		},
	});

	server.route({
		method: 'PATCH',
		path: '/{id}',
		handler: function (request, reply) {
			db.groups.update({
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
			description: 'Update a group',
			tags: ['api'],
			validate: {
				params: {
					id: Joi.string().required(),
				},
				payload: groupSchema.required().min(1)
			}
		},
	});

	server.route({
		method: 'DELETE',
		path: '/{id}',
		handler: function (request, reply) {
			db.groups.remove({
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
			description: 'Delete a group',
			tags: ['api'],
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
	name: 'routes-groups'
};
