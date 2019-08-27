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
        model.Grooming.find()
        .lean()
        .exec(function(err, res){
            if(err){
                secure.error(reply, err)
                return
            }
            secure.success(reply, res, count)
        })
    },
    clinic: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
        model.Clinic.find()
        .lean()
        .exec(function(err, res){
            if(err){
                secure.error(reply, err)
                return
            }
            secure.success(reply, res, count)
        })
    },
    hotel: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
        model.Hotel.find()
        .lean()
        .exec(function(err, res){
            if(err){
                secure.error(reply, err)
                return
            }
            secure.success(reply, res, count)
        })
    },
    transaction: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
        if (!model || model.Transaction === undefined) model = require('./../../routes/model');
        model.Transaction.find()
        .lean()
        .exec(function(err, res){
            if(err){
                secure.error(reply, err)
                return
            }
            secure.success(reply, res)
        })
    }
}