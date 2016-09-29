'use strict';

const Boom = require('boom');
const Joi = require('joi');
const mongojs = require('mongojs');

exports.register = function(server, options, next) {
	const db = server.app.db;

	server.route({
		method: 'GET',
		path: '/groups',
		handler: function (request, reply) {
			db.users.find(function(err, docs) {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(docs);
			});
		},
	});

	server.route({
		method: 'GET',
		path: '/groups/{id}',
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
	});

	server.route({
		method: 'POST',
		path: '/groups',
		handler: function (request, reply) {
			const group = request.payload;

			//Create an id
			group._id = mongojs.ObjectID();

			db.groups.save(user, (err, result) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(user);
			});
		},
		config: {
			validate: {
				payload: {
					name: Joi.string().min(10).max(50).required(),
					email: Joi.string().min(10).max(50).required()
				}
			}
		},
	});

	server.route({
		method: 'PATCH',
		path: '/groups/{id}',
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
			validate: {
				payload: Joi.object({
					name: Joi.string().min(10).max(50).optional(),
					email: Joi.string().min(10).max(50).optional()
				}).required().min(1)
			}
		},
	});

	server.route({
		method: 'DELETE',
		path: '/groups/{id}',
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
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-groups'
};
