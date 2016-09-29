'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');
const mongo = require('./mongo.json');

const server = new Hapi.Server();

server.connection({
	port: 8000
});

server.app.db = mongojs(
	`mongodb://${mongo.username}:${mongo.password}@${mongo.host}:27017/buddy`,
	['groups', 'users']
);

//Load plugins and start server
server.register([
	require('./routes/groups'),
	require('./routes/users')
], {
	routes: {
		prefix: '/api'
	}
}, (err) => {
	if (err) {
		throw err;
	}

	// Start the server
	server.start((err) => {
		console.log('Server running at:', server.info.uri);
	});
});
