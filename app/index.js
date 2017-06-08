'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

const server = new Hapi.Server();

server.connection({
	port: 8000
});

server.app.db = mongojs(
	`mongodb://mongodb:27017/buddy`,
	['groups', 'users']
);

//Load plugins and start server
server.register([
	{
		register: require('./routes/groups'),
		routes: {
			prefix: '/api/groups',
		},
	},
	{
		register: require('./routes/users'),
		routes: {
			prefix: '/api/users',
		},
	},

	require('inert'),

	require('vision'),

	{
		register: require('hapi-swaggered'),
		options: {
			tagging: {
				mode: 'path',
				pathLevel: 2,
			},
			info: {
				title: 'Buddy API',
				description: 'A new users system for the Icelandic Scout Association.',
				version: '1.0',
			}
		}
	},

	{
		register: require('hapi-swaggered-ui'),
		options: {
			title: 'Buddy API',
			path: '/docs',
			authorization: false,
		},
	}
])
	.then(() => {
		server.route({
			path: '/',
			method: 'GET',
			handler: function (request, reply) {
				reply.redirect('/docs')
			},
		});

		// Start the server
		server.start((err) => {
			console.log('Server running at:', server.info.uri);
		});
	});
