const secure = require('./auth');
const Env = require('./../../config/config');
const email = require('emailjs');
const async = require('async');
const _ = require('lodash');
const md5 = require('md5');
const passwordHash = require('password-hash');
const moment = require('moment');
const helper = require('./../libs/helper');
const allowAuth = require('./../libs/allowed')
// console.log(allowAuth.allow['register'])

let model = require('./../../routes/model');

module.exports = {
	action: function(req,reply) {
		let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
        let action = getParams.action;
        console.log(action)
        if(allowAuth.allow[action]){
            module.exports[action](req, reply);
        } else {
            secure.auth(queryParams.token,queryParams.id,function(authorized){
                if (authorized.success) {
                    console.log('>> '+action);
                    module.exports[action](req,reply,authorized.session);
                } else {
                    secure.sessionExpired(reply);
                }
            });
        }
        
    },
    grooming: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
    },
    clinic: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
    },
    hotel: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
    },
    transaction: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
    }
}