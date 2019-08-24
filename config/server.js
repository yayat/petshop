'use strict';

let Env;
const Hapi = require('hapi');
const Route = require('./../routes/route');

// Setup Environment 
Env = require('./config');

require('./../schedules/db');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: Env.serverHost, 
    port: Env.serverPort,
	routes: {
		cors: Env.serverOptions.cors
	}
});

server.route(Route);

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log("================================================ PET SHOP ===============================================")
    console.log("================================ API "+ Env.serverType +" running on "+ Env.serverHost +":"+ Env.serverPort + " ===============================")
    console.log("==========================================================================================================")
});
