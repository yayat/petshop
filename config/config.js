const environtment = 'dev'; 

let Env;

if (environtment == 'prod' || environtment == 'production') {
	Env = require('./config-production');	
} else {
	Env = require('./config-local');
}

module.exports = Env;