module.exports = (function(){
	var globalEnv = this,
		objectPrototype = Object.prototype,
		toString = objectPrototype.toString,
		enumerables = true,
		enumerablesTest = { toString: 1 },
		emptyFn = function () {},
		callOverrideParent = function () {
			var method = callOverrideParent.caller.caller;
			return method.$owner.prototype[method.$name].apply(this, arguments);
		},
		nonWhitespaceRe = /\S/,
		iterableRe = /\[object\s*(?:Array|Arguments|\w*Collection|\w*List|HTML\s+document\.all\s+class)\]/;
	Function.prototype.$devIsFunction = true;
	globalEnv.dev = this;
	dev.global = globalEnv;
	for (i in enumerablesTest) {
		enumerables = null;
	}
	if (enumerables) {
		enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
			'toLocaleString', 'toString', 'constructor'];
	}
	dev.enumerables = enumerables;
	var os = require('os');
	String.prototype.endsWith = function(s) {
		return this.length >= s.length && this.substr(this.length - s.length) == s;
	};

	dev.json = function(data){
		if (!data || data == undefined) return false;
		if (typeof data == 'string') return JSON.parse(data) 
		else return JSON.parse(JSON.stringify(data))
	};

	dev.util = {
		apply: function(object, config, defaults) {
			if (defaults) {
				dev.util.apply(object, defaults);
			}
			if (object && config && typeof config === 'object') {
				var i, j, k;
				for (i in config) {
					object[i] = config[i];
				}
				if (enumerables) {
					for (j = enumerables.length; j--;) {
						k = enumerables[j];
						if (config.hasOwnProperty(k)) {
							object[k] = config[k];
						}
					}
				}
			}
			return object;
		},
		network:{
			interfaces: (function getAllLocalAddress(){
				var interfaces = os.networkInterfaces();
				var addresses = [];
				for (k in interfaces) {
					for (k2 in interfaces[k]) {
						var address = interfaces[k][k2];
						if (address.family == 'IPv4' && !address.internal) {
							addresses.push({
								interface: k,
								address: address.address
							});
						}
					}
				}
				return addresses;
			})(),
			localIOAddress: null,
			getAddressByInterface: function(interface){
				for (var i=0; i<dev.util.network.interfaces.length; i++) {
					if (dev.util.network.interfaces[i].interface == interface) {
						return dev.util.network.interfaces[i];
					} else {
						return false;
					}
				}
			},
			setActiveIOAddressByInterface: function(interface){
				dev.util.network.localIOAddress = dev.util.network.getAddressByInterface(interface).address;
				return dev.util.network.localIOAddress;
			},
			validateAddressV4: function(ipaddress){
				if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)){
					return (true);
				} else {
					return (false);
				}
			}
		},
		whatAmI: function(me){
			var result = Object.prototype.toString.call(me).split(/\W/)[2];
			return result.toLowerCase();
		},
		token: function(){
			var d = (Date.now()) ? Date.now() : new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-yxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c=='x' ? r : (r&0x7|0x8)).toString(16);
			});
			return uuid;
		},
		key: function(){
			var d = (Date.now()) ? Date.now() : new Date().getTime();
			var uuid = 'xxxxxxxxyxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c=='x' ? r : (r&0x7|0x8)).toString(16);
			});
			return uuid;
		},
		objectMerge: function(){
			var dst = {},
				src,
				p,
				args = [].splice.call(arguments, 0);
			while (args.length > 0) {
				src = args.splice(0, 1)[0];
				if (toString.call(src) == '[object Object]') {
					for (p in src) {
						if (src.hasOwnProperty(p)) {
							if (toString.call(src[p]) == '[object Object]') {
								dst[p] = dev.util.objectMerge(dst[p] || {}, src[p]);
							} else {
								dst[p] = src[p];
							}
						}
					}
				}
			}
			return dst;
		},
		forEach: function(collection, callBack){
			var
			/* Array and string iteration */
				i = 0,
			/* Collection length storage for loop initialisation */
				iMax = 0,
			/* Object iteration */
				key = '',
				collectionType = '';
			/* Verify that callBack is a function */
			if (typeof callBack !== 'function') {
				throw new TypeError("forEach: callBack should be function, " + typeof callBack + "given.");
			}
			/* Find out whether collection is array, string or object */
			switch (Object.prototype.toString.call(collection)) {
				case "[object Array]":
					collectionType = 'array';
					break;
				case "[object Object]":
					collectionType = 'object';
					break;
				case "[object String]":
					collectionType = 'string';
					break;
				default:
					collectionType = Object.prototype.toString.call(collection);
					throw new TypeError("forEach: collection should be array, object or string, " + collectionType + " given.");
			}
			switch (collectionType) {
				case "array":
					for (i = 0, iMax = collection.length; i < iMax; i += 1) {
						callBack(collection[i], i);
					}
					break;
				case "string":
					for (i = 0, iMax = collection.length; i < iMax; i += 1) {
						callBack(collection.charAt(i), i);
					}
					break;
				case "object":
					for (key in collection) {
						/* Omit prototype chain properties and methods */
						if (collection.hasOwnProperty(key)) {
							callBack(collection[key], key);
						}
					}
					break;
				default:
					throw new Error("Continuity error in forEach, this should not be possible.");
			}
			return null;

			/**
			 * Example uses
			 */

			/**** Array example ****/
			/*
			 forEach(["a", "b", "c"], function (value, index) {
			 console.log(index + ": " + value);
			 });
			 */

			/**** Object example ****/
			/*
			 forEach({"foo": "bar", "barfoo": "foobar"}, function (value, key) {
			 console.log(key + ": " + value);
			 });
			 */

			/**** String example ****/
			/*
			 forEach("Hello, world!", function (character, index) {
			 console.log(index + ": " + character);
			 });
			 */
		},
		remElFromArray: function(elArray, elIndex, elLength){
			var i = 0;
			var resAr = [];
			elArray.forEach(function(item){
				if (! ((i >= elIndex) && (i-1 < elIndex+elLength-1)) ) {
					resAr.push(item);
				}
				i++;
			});
			return resAr;
		}

	};
	dev.util.apply(dev.util, {
		applyIf: function(object, config) {
			var property;
			if (object) {
				for (property in config) {
					if (object[property] === undefined) {
						object[property] = config[property];
					}
				}
			}
			return object;
		},
		valueFrom: function(value, defaultValue, allowBlank){
			return dev.util.isEmpty(value, allowBlank) ? defaultValue : value;
		},
		typeOf: function(value) {
			var type,
				typeToString;
			if (value === null) {
				return 'null';
			}
			type = typeof value;
			if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
				return type;
			}
			typeToString = toString.call(value);
			switch(typeToString) {
				case '[object Array]':
					return 'array';
				case '[object Date]':
					return 'date';
				case '[object Boolean]':
					return 'boolean';
				case '[object Number]':
					return 'number';
				case '[object RegExp]':
					return 'regexp';
			}
			if (type === 'function') {
				return 'function';
			}
			if (type === 'object') {
				if (value.nodeType !== undefined) {
					if (value.nodeType === 3) {
						return (nonWhitespaceRe).test(value.nodeValue) ? 'textnode' : 'whitespace';
					}
					else {
						return 'element';
					}
				}
				return 'object';
			}
		},
		isEmpty: function(value, allowEmptyString) {
			return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (dev.util.isArray(value) && value.length === 0);
		},
		isArray: ('isArray' in Array) ? Array.isArray : function(value) {
			return toString.call(value) === '[object Array]';
		},
		isDate: function(value) {
			return toString.call(value) === '[object Date]';
		},
		isObject: (toString.call(null) === '[object Object]') ?
			function(value) {
				// check ownerDocument here as well to exclude DOM nodes
				return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
			} :
			function(value) {
				return toString.call(value) === '[object Object]';
			},
		isSimpleObject: function(value) {
			return value instanceof Object && value.constructor === Object;
		},
		isPrimitive: function(value) {
			var type = typeof value;
			return type === 'string' || type === 'number' || type === 'boolean';
		},
		isFunction: function(value) {
			return !!(value && value.$devIsFunction);
		},
		isNumber: function(value) {
			return typeof value === 'number' && isFinite(value);
		},
		isNumeric: function(value) {
			return !isNaN(parseFloat(value)) && isFinite(value);
		},
		isString: function(value) {
			return typeof value === 'string';
		},
		isBoolean: function(value) {
			return typeof value === 'boolean';
		},
		isElement: function(value) {
			return value ? value.nodeType === 1 : false;
		},
		isTextNode: function(value) {
			return value ? value.nodeName === "#text" : false;
		},
		isDefined: function(value) {
			return typeof value !== 'undefined';
		}
	});
	dev.util.apply(dev.util, {
		extend: (function() {
			// inline overrides
			var objectConstructor = objectPrototype.constructor,
				inlineOverrides = function(o) {
					for (var m in o) {
						if (!o.hasOwnProperty(m)) {
							continue;
						}
						this[m] = o[m];
					}
				};

			return function(subclass, superclass, overrides) {
				// First we check if the user passed in just the superClass with overrides
				if (dev.util.isObject(superclass)) {
					overrides = superclass;
					superclass = subclass;
					subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
						superclass.apply(this, arguments);
					};
				}


				// We create a new temporary class
				var F = function() {},
					subclassProto, superclassProto = superclass.prototype;

				F.prototype = superclassProto;
				subclassProto = subclass.prototype = new F();
				subclassProto.constructor = subclass;
				subclass.superclass = superclassProto;

				if (superclassProto.constructor === objectConstructor) {
					superclassProto.constructor = superclass;
				}

				subclass.override = function(overrides) {
					dev.util.override(subclass, overrides);
				};

				subclassProto.override = inlineOverrides;
				subclassProto.proto = subclassProto;

				subclass.override(overrides);
				subclass.extend = function(o) {
					return dev.util.extend(subclass, o);
				};

				return subclass;
			};
		}()),
		override: function (target, overrides) {
			if (target.$isClass) {
				target.override(overrides);
			} else if (typeof target == 'function') {
				dev.util.apply(target.prototype, overrides);
			} else {
				var owner = target.self,
					name, value;
				if (owner && owner.$isClass) { // if (instance of Ext.define'd class)
					for (name in overrides) {
						if (overrides.hasOwnProperty(name)) {
							value = overrides[name];
							if (typeof value == 'function') {
								value.$name = name;
								value.$owner = owner;
								value.$previous = target.hasOwnProperty(name)
									? target[name] // already hooked, so call previous hook
									: callOverrideParent; // calls by name on prototype
							}
							target[name] = value;
						}
					}
				} else {
					dev.util.apply(target, overrides);
				}
			}
			return target;
		},
		callbackWarn: function(code, tag, message){
			console.log('** Callback warning | Callback should be a function **');
			console.log('   -- Code    : ', code);
			console.log('   -- Tag     : ', tag);
			console.log('   -- Message : ', message);
		}
	});

	return this.dev;
})();