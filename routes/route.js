const authController = require('./../controller/app/auth');
const appsController = require('../controller/app/apps');
const adminController = require('../controller/app/admin');
const userController = require('../controller/app/user');
const courierController = require('../controller/app/courier');



const routes = [
	{
	    method: 'GET',
	    path: '/hello', 
	    handler: function (request, reply) {
	        return reply('H-E-L-L-O');
	    }
	},
	{
		method: ['GET', 'POST'],
		path: '/petshop/{action}',
		config: {
			handler: function(req, reply) {
				console.log('-auth-')
				// authController.action(req,reply)
				adminController.action(req, reply)
			}
		}
	},
	{
		method: ['GET', 'POST'],
		path: '/courier/{action}',
		config: {
			handler: function(req, reply) {
				console.log('-courier-')
				courierController.action(req,reply)
			}
		}
	},
	{
		method: ['GET', 'POST'],
		path: '/customer/{action}',
		config: {
			handler: function(req, reply) {
				console.log('-auth-')
				userController.action(req,reply)
			}
		}
	},
	{
		method: ['GET', 'POST'],
		path: '/{action}',
		config: {
			handler: function(req, reply) {
				console.log('-auth-')
				userController.action(req,reply)
			}
		}
	}
]

module.exports = routes;
