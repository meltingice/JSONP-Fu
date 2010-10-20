/*global window */

var jsonpfu = {},
	jfu = jsonpfu; // shortcut
	
(function (window) {

	// define mah vars
	var	script, log,
		info, error,
		path = window.location.pathname,
		libs = {},
		lib_opts = {},
		exception,
		ready_callbacks = {};
		
	if (path.substr(path.length - 1) === '/') {
		path = path.substr(0, path.length - 1);
	}
	
	/*
	 * Make my life easier while debugging and
	 * avoid issues with IE.
	 */
	if (!('console' in window)) {
		window.console = {
			log: function (msg) { },
			error: function (msg) { },
			info: function (msg) { }
		};
	}
	
	log = function (text) {
		if (typeof(text) === 'string') {
			console.log('JSONP-Fu: ' + text);
		} else {
			console.log(text);
		}
	};
	
	info = function (text) {
		if (typeof(text) === 'string') {
			console.info('JSONP-Fu: ' + text);
		} else {
			console.info(text);
		}
	};
	
	error = function (text) {
		console.error('JSONP-Fu: ' + text);
	};
	
	exception = function (text) {
		throw 'JSONP-Fu: ' + text;
	};
	
	/*
	 * Utility functions to include and remove scripts from
	 * the page header.
	 */
	script = (function () {
		var head = document.getElementsByTagName('head')[0],
			scripts = {};
		
		return {
			/*
			 * If given a name, we can store the script object
			 * in a private variable so we can remove the script
			 * from the header later if we want *easily*
			 */
			include: function (url, callback, name) {
				var new_script = document.createElement('script');
				
				if (typeof(callback) !== 'function') {
					callback = function () {};
				}
				
				new_script.type = 'text/javascript';
				new_script.src = url;
				new_script.onload = function () {
					if (name) {
						scripts[name] = new_script;
					}
					
					callback();
				};
				
				head.appendChild(new_script);
			},
			
			/*
			 * If the script was included with a name, then
			 * we can easily remove it by doing this.
			 */
			remove: function (name) {
				if (scripts[name]) {
					head.removeChild(scripts[name]);
					delete scripts[name];
				}
			},
			
			include_lib: function (lib, callback) {
				this.include(path + '/lib/' + lib + ".js", function () {
					info(lib + " library loaded");
					callback();
				}, lib);
			},
			
			/*
			 * Makes a JSONP query, automatically generates a callback
			 * function (and name, if needed), and calls the callback function.
			 */
			jsonp_query: function (user_opts) {
				var options = {
						url: '/',
						data: {},
						callback: "JSONPFuCallback" + new Date().getTime(),
						callback_param: 'callback',
						success: function (data) {}
					}, i, query_string = '';
				
				for (i in options) {
					if (options.hasOwnProperty(i)) {
						if (user_opts[i]) {
							options[i] = user_opts[i];
						}
					}
				}
				
				/* Register JSONP callback function */
				while (options.callback in window) {
					options.callback += Math.floor(Math.random() * 9999);
				}
				
				if (!(options.callback in window)) {
					window[options.callback] = function (jsonp_data) {
						options.success(jsonp_data);
						
						// cleanup the global window variable
						delete window[options.callback];
					};
				}
				
				options.url += '?';
				
				for (i in options.data) {
					if (options.data.hasOwnProperty(i)) {
						query_string += '&' + i + '=' + options.data[i];
					}
				}
				
				options.url += query_string.substr(1);
				
				if (query_string.length > 0) {
					options.url += '&';
				}
				
				options.url += options.callback_param + '=' + options.callback;
				
				log('Query\n' + options.url);
				
				/* 
				 * Make JSONP call, then remove script from header once
				 * it loads for cleanup purposes.
				 */
				this.include(options.url, function () {
					script.remove(options.callback);
				}, options.callback);
			}
		};
	}());
	
	/*
	 * Used when including JSONP-Fu library files. Need to know
	 * the correct absolute path to JSONP-Fu.
	 *
	 * e.g. JSONP-Fu is in http://meltingice.net/js/jsonp-fu/, so we run:
	 *		jsonpfu.set_path('/js/jsonp-fu/');
	 */
	jsonpfu.set_path = function (new_path) {

		// Remove trailing slash if present
		if (new_path.substr(new_path.length - 1) === '/') {
			new_path = new_path.substr(0, new_path.length - 1);
		}
		
		path = new_path;
	};
	
	/*
	 * Loads a JSONP-Fu library in 1 of 2 possible ways, either
	 * one at a time, or all at once:
	 *
	 * 1: load({ flickr: { opt: val }, twitpic: { opt: val } });
	 * 2: load('flickr', { opt: val });
	 */
	jsonpfu.load = function (opt1, opt2) {
		var	lib, i,
			load_lib = function (lib, opts) {
				lib_opts[lib] = opts;
				
				script.include_lib(lib, function () {
					// Library requires manual ready state (e.g. Facebook)
					if (!libs[lib]) {
						return;
					}
					
					if (ready_callbacks[lib]) {
						for (i = 0; i < ready_callbacks[lib].length; i++) {
							ready_callbacks[lib].pop().call(libs[lib]);
						}
					}
				});
			};
		
		if (typeof(opt1) === 'object') {
			for (lib in opt1) {
				if (opt1.hasOwnProperty(lib)) {
					load_lib(lib, opt1[lib]);
				}
			}
		} else if (typeof(opt1) === 'string') {
			load_lib(opt1, opt2);
		}
	};
	
	jsonpfu.manual_ready = function (lib, obj) {
		var i;
		
		libs[lib] = obj;
		
		if (ready_callbacks[lib]) {
			for (i = 0; i < ready_callbacks[lib].length; i++) {
				ready_callbacks[lib].pop().call(libs[lib]);
			}
		}
	};
	
	jsonpfu.extend = function (name, lib) {
		libs[name] = lib.call(this, lib_opts[name], script);
	};
	
	jsonpfu.lib = function (lib) {
		if (!libs[lib]) {
			exception('attempt to access non-loaded library ' + lib);
		}
		
		return libs[lib];
	};
	
	jsonpfu.ready = function (lib, callback) {
		if (!callback || typeof(callback) !== 'function') {
			return;
		}
		
		if (libs.hasOwnProperty(lib)) {
			callback.call(libs[lib]);
		} else {
			if (!ready_callbacks[lib]) {
				ready_callbacks[lib] = [];
			}
			
			ready_callbacks[lib].push(callback);
		}
	};

}(window));