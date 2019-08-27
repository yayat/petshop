const mongoose = require('mongoose');
const conf = require('./../config/config');
let async = require('async');

var options = {
    config: {
        autoIndex: true
    },
    server: {
        poolSize: 10,
        reconnectInterval: 0
    }
};

var objExport = {};
console.log('start mongo connection ...');
async.parallel({
	PETSHOP: function(cb) {
		console.log('# mongo | connecting ... Host: '+ conf.mongoPs.dbHost);
		var optionRd = {
			server: {
				socketOptions: {
					keepAlive: true,
					socketTimeoutMS: 0,
					connectTimeoutMS: 30000
				}
			},
			replset: {
				socketOptions: {
					keepAlive: true,
					socketTimeoutMS: 0,
					connectTimeoutMS : 30000
				},
				reconnectTries: 30
			}
		};
		if (conf.mongoPs.auth) optionRd.auth = {authdb: conf.mongoPs.auth}		
		console.log('config',optionRd)
		var mongooseUrl = 'mongodb://'+conf.mongoPs.dbUser+':'+conf.mongoPs.dbPass+'@'+conf.mongoPs.dbHost+':'+conf.mongoPs.dbPort+'/'+conf.mongoPs.dbName;
		mongoPs = mongoose.createConnection(mongooseUrl, optionRd, function(err){
			if(!err){
				console.log('# mongo | ='+conf.serverType+'= | connected | Host: '+ conf.mongoPs.dbHost + ' | DB: '+ conf.mongoPs.dbName);
				
				const User = require('./../models/user');
				const Grooming = require('./../models/grooming');
				const Transaction = require('./../models/transaction');
				const Clinic = require('./../models/clinic');
				const Hotel = require('./../models/hotel');
				const Petshop = require('./../models/petshop');

				objExport.Grooming = mongoPs.model('Grooming', Grooming);
				objExport.Transaction = mongoPs.model('Transaction', Transaction);
				objExport.Clinic = mongoPs.model('Clinic', Clinic);
				objExport.User = mongoPs.model('User', User);
				objExport.Hotel = mongoPs.model('Hotel', Hotel);
				objExport.Petshop = mongoPs.model('Petshop', Petshop);
				cb();
				
			} else {
				console.log('# mongo PETSHOP - Error : ' + JSON.stringify(err.message))
			}
		});	
	}
}, function() {
	// console.log('obj',objExport);
	module.exports = objExport;

});