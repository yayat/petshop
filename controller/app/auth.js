
let model = require('./../../routes/model');
let fs = require('fs');
let Env = require('./../../config/config');
let path = require('path');
let jsonfile = require('jsonfile');
let moment = require('moment');
let dev = require('./../libs/dev');
let sha1 = require('sha1');
let directoryAuth = path.join(__dirname, '../../cookies');
const md5 = require('md5');
const allowAuth = require('./../libs/allowed')

module.exports = {
	action: function(req,reply) {
		let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
		let action = getParams.action;
		
		if(allowAuth.allow[action]){
			console.log(action)
			module.exports[action](req, reply);

		} else {
			module.exports.unauthorized(reply); return false;
		}
	},
	error: function(reply,error) {
		reply({
			success: false,
			ver: Env.api.version,
			errorCode: 'ER0001',
			error: 'Error',
			message: error
		})
	},
	success: function(reply, data, length){
		reply({
			success: true,
			data: data,
			length: length
		})
	},
	unauthorized: function(reply) {
		let apiError = {
			success: false,
			ver: Env.api.version,
			errorCode: 'E0001',
			error: 'Unauthorized user'
		}
		reply(apiError);
	},
	invalidUser: function(reply) {
		let apiError = {
			success: false,
			ver: Env.api.version,
			errorCode: 'E0002',
			error: 'Invalid username or password. Please try again'
		}
		reply(apiError);
	},
	sessionExpired: function(reply) {
		let apiError = {
			success: false,
			ver: Env.api.version,
			errorCode: 'E0003',
			error: 'Session Expired'
		}
		reply(apiError);
		
    },
	login: function(req,reply) {
		if (!model || model.User === undefined) model = require('./../../routes/model');
		let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
		let obj = {
			"username": postParams.username, "password": md5(postParams.password), "isActive" : true
		}
		model.User.find(obj).exec(function(err, res){
			
			if (err) {
				module.exports.unauthorized(reply);
			}
			if(res && res.length > 0){
				let jsonObject = dev.json(res[0]);
				let directoryAuth = path.join(__dirname, '../../cookies');
				let token = dev.util.token();
				jsonObject.expired = moment().add(8, 'hours').format('x');
				jsonObject.key = jsonObject._id;
				delete jsonObject.pwd;
				delete jsonObject._id;
				jsonfile.writeFileSync(directoryAuth +'/'+ token + '.json', jsonObject);
				reply({
					success: true,
					data: jsonObject,
					token: token
				})
			} else {
				// console.log('# error : username, password or inactive user');
				module.exports.invalidUser(reply);
			}	
		})
	},
	
	getSession: function(token,callback) {
		jsonfile.readFile(directoryAuth +'/'+token + '.json', 'utf8', function (err, data) {
			if(err){
				callback(false);
			} else {
				callback(data);
			}
		});
	},
	auth: function(token,key,callback) {
		console.log(token)
		console.log(key)
		jsonfile.readFile(directoryAuth +'/'+token + '.json', 'utf8', function (err, data) {
			if (err) {
				callback(false);
			} 
			let cookie = dev.json(data);
			let expired = moment(cookie.expired, 'x').format('YYYY-MM-DD HH:mm:ss')
			let now = moment().format('YYYY-MM-DD HH:mm:ss')
			if (now > expired) {
				callback(false);
			} else {
				cookie.key == key ? callback({'success':true,'session':cookie}) : callback(false);
			}
		});
	},
	logout: function (req, reply) {
		let postParams = req.payload;
		jsonfile.readFile(directoryAuth +'/'+ postParams.token + '.json', 'utf8', function (err, data) {
			if (err) {
				callback(false);
			} 
			let cookie = dev.json(data);
			if (cookie.key == key) 
			{
				fs.unlink(directoryAuth + '/' + postParams.token + '.json', function (err, success) {
					if (!err){
						reply({
							success: true,
							message: 'User Logout'
						})
					} else {
						reply({
							success: true,
							message: 'User Logout'
						})
					}
				})
				
			}
		})

	}
}