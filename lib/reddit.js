/*global jsonpfu */

/**
 * Name: Reddit
 * Desc: Used to query the Reddit JSONP API (http://code.reddit.com/wiki/API)
 * Usage:
 *	jfu.lib('reddit').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('reddit').front_page.hot({}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('reddit', function (opts, script) {
	// API helper methods for validation and querying
	var API = {
		query: function (url, data, callback) {
			var	query_url,
				route = /:([A-Za-z_]+)/gi,
				matches, i;
			
			// Check for routing
			if (route.test(url)) {
				matches = url.match(route);
				if (matches.length > 0) {
					for (i = 0; i < matches.length; i++) {
						if (data[matches[i].substr(1)]) {
							url = url.replace(matches[i], data[matches[i].substr(1)]);
							delete data[matches[i].substr(1)];
						}
					}
				}
			}

			/*
			 * This is a bit of a crude way to check to see if all arguments are
			 * present but it works. Instead of throwing an error, we just silently
			 * return because some methods have multiple different routes.
			 */
			if (route.test(url)) {
				return;
			}			
			
			query_url = 'http://reddit.com/' + url + '.json';
			
			
			script.jsonp_query({
				url: query_url,
				data: data,
				callback_param: 'jsonp',
				success: function (data) {
					callback(data);
				}
			});
			
			return true;
		}
	};
	
	return {
		front_page: {
			hot: function (args, callback) {
				API.query('', args, callback);
			},
			
			show_new: function (args, callback) {
				API.query('new', args, callback);
			},
			
			controversial: function (args, callback) {
				API.query('controversial', args, callback);
			},
			
			top: function (args, callback) {
				API.query('top', args, callback);
			}
		},
		
		subreddit: {
			hot: function (args, callback) {
				API.query('r/:name', args, callback);
			},
			
			show_new: function (args, callback) {
				API.query('r/:name/new', args, callback);
			},
			
			controversial: function (args, callback) {
				API.query('r/:name/controversial', args, callback);
			},
			
			top: function (args, callback) {
				API.query('r/:name/top', args, callback);
			}
		},
		
		r: function (subreddit) {
			var that = this;
			return {
				hot: function (args, callback) {
					args.name = subreddit;
					that.subreddit.hot(args, callback);
				},
				
				show_new: function (args, callback) {
					args.name = subreddit;
					that.subreddit.show_new(args, callback);
				},
				
				controversial: function (args, callback) {
					args.name = subreddit;
					that.subreddit.controversial(args, callback);
				},
				
				top: function (args, callback) {
					args.name = subreddit;
					that.subreddit.top(args, callback);
				}
			};
		},
		
		post: {
			show: function (args, callback) {
				var result = API.query('comments/:id', args, callback);
				if (result) {
					return;
				}
				
				API.query('by_id/:fullname', args, callback);
			}
		},
		
		url: function (args, callback) {
			var query_url;
			
			if (!args.url) {
				throw "url function requires url parameter";
			}
			
			query_url = args.url + '.json';
			delete args.url;
			
			script.jsonp_query({
				url: query_url,
				data: args,
				callback_param: 'jsonp',
				success: function (data) {
					callback(data);
				}
			});
		},
		
		user: {
			overview: function (args, callback) {
				API.query('user/:username', args, callback);
			},
			
			comments: function (args, callback) {
				API.query('user/:username/comments', args, callback);
			},
			
			submitted: function (args, callback) {
				API.query('user/:username/submitted', args, callback);
			},
			
			liked: function (args, callback) {
				API.query('user/:username/liked', args, callback);
			},
			
			disliked: function (args, callback) {
				API.query('user/:username/disliked', args, callback);
			},
			
			hidden: function (args, callback) {
				API.query('user/:username/hidden', args, callback);
			}
		},
		
		search: function (args, callback) {
			args.restrict_sr = "on";
			var result = API.query('r/:restrict/search', args, callback);
			if(result) {
				return;
			}
			
			delete args.restrict_sr;
			
			API.query('search', args, callback);
		}
	};
	
});