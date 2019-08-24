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
const auth = require('./auth');
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
    login: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
        auth.action(req, reply)
    },
    getUser: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
        // for paging
        var page = 0
        page = Number(postParams.page)

        var skip = 0
        var limit = 0

        if (page > 0) {
            skip = (page - 1) * 30
            limit = 30
        }
        // for paging

        let obj = {}
        if(postParams){
            if(postParams._id){
                obj._id = postParams._id
            }
            if(postParams.keyword){
                obj = {
					$or: [{
							name: new RegExp(postParams.keyword, 'i')
						},
						{
							phone: new RegExp(postParams.keyword, 'i')
						}
					]
				}
            }
            if(postParams.angkatan){
                obj.angkatan = postParams.angkatan
            }
        }
        model.User.count(obj, function (err, count) {
            if (!model || model.User === undefined) model = require('./../../routes/model');
            model.User.find(obj)
            .lean()
            .skip(skip)
			.limit(limit)
            .exec(function(err, res){
                if(err){
                    secure.error(reply, err)
                    return
                }
                secure.success(reply, res, count)
            })
        })

    },
    createUser: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
        var newUser = model.User;
        let obj = {
            name: postParams.name,
            usr: postParams.usr,
            pwd: md5(postParams.pwd),
            role: postParams.role
        }
        var objUser = new newUser(obj);
        if (!model || model.User === undefined) model = require('./../../routes/model');
        objUser.save(function (err, row) {
            if (err) {
                secure.error(reply, err)
                return
            }
            secure.success(reply, row, row.length)
        });
    },
    updateUser: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
        
        let obj = {}
        if(postParams){
            if(postParams.isActive){
                obj.isActive = postParams.isActive
            }
            if(postParams.pwd){
                obj.pwd = postParams.pwd
            }
        }
        // console.log(obj)
        if (!model || model.User === undefined) model = require('./../../routes/model');
        model.User.update({'_id': postParams._id}, {$set: obj}, function(err, res){
            if(err){
                secure.error(reply, err)
                return
            }
            secure.success(reply, res, res.length)
        })
    },
    grooming: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
    },
    clinic: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
    },
    hotel: function(req, reply){
        let getParams = req.params, postParams = req.payload, queryParams = req.query, headers = req.headers; addSetQuery = '', addValQuery = '';
    }
}