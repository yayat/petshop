const dev = require('../controller/libs/dev');
const ipLocal = dev.util.network.interfaces[0] ? dev.util.network.interfaces[0].address : 'localhost';
module.exports = {
	serverHost: ipLocal ,
	serverType: 'development',
	serverPort: '8385',
	api: {
		version: '1.0.0',
		name: '',
		description: ''
	},
	serverOptions: {
		cors: {
			origin: ['*'],
			maxAge: 259200,
			headers: ['Authorization', 'Content-Type', 'If-None-Match', 'Origin', 'X-Requested-With', 'Accept', 'X-HTTP-Method-Override', 'Cookies', 'X-Forwarded-For', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin'],
			credentials: true
		}
	},
	mongoPs: {
		dbHost      : '127.0.0.1',
		dbUser      : '',
		dbPass      : '',
		dbPort      : 27017,
		dbName      : 'pet_shop',
		auth 		: 'admin'
	}
}