'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

const server = new Hapi.Server();

server.connection({
	port: 8000
});

server.app.db = mongojs('mongodb://mongodb:27017/buddy', ['users']);

//Load plugins and start server
server.register([
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
