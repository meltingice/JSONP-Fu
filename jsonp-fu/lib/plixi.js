/*global jsonpfu */

/**
 * Name: Plixi
 * Desc: Used to query the Plixi JSONP API (http://groups.google.com/group/plixi/web)
 * Usage:
 *	jfu.lib('plixi').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('plixi').user.show({user: 'meltingice'}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('plixi', function (opts, script) {
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
			
			query_url = 'http://api.plixi.com/api/tpapi.svc/jsonp/' + url;
			
			script.jsonp_query({
				url: query_url,
				data: data,
				success: function (data) {
					callback(data);
				}
			});
			
			return true;
		}
	};
	
	return {
		user: {
			show: function (args, callback) {
				API.query('users/:user', args, callback);
			},
			
			comments: function (args, callback) {
				API.query('users/:id/comments', args, callback);
			},
			
			friends: function (args, callback) {
				API.query('users/:id/friends', args, callback);
			},
			
			favorites: function (args, callback) {
				API.query('users/:id/favorites', args, callback);
			},
			
			photos: function (args, callback) {
				API.query('users/:id/photos', args, callback);
			},
			
			photo_iterator: {
				next: function (args, callback) {
					API.query('users/:user_id/photos/:photo_id/next', args, callback);
				},
				
				previous: function (args, callback) {
					API.query('users/:user_id/photos/:photo_id/previous', args, callback);
				}
			},
			
			has_favorited: function (args, callback) {
				API.query('users/:user_id/favorites/:photo_id', args, callback);
			},
			
			feed: function (args, callback) {
				API.query('users/:id/feed', args, callback);
			}
		},
		
		photo: {
			show: function (args, callback) {
				API.query('photos/:id', args, callback);
			},
			
			comments: function (args, callback) {
				API.query('photos/:id/comments', args, callback);
			},
			
			favorizers: function (args, callback) {
				API.query('photos/:id/favorizers', args, callback);
			},
			
			tags: function (args, callback) {
				API.query('photos/:id/tags', args, callback);
			},
			
			viewers: function (args, callback) {
				API.query('photos/:id/viewers', args, callback);
			},
			
			meta_from_url: function (args, callback) {
				API.query('metadatafromurl', args, callback);
			}
		},
		
		photos: {
			iterator: {
				next: function (args, callback) {
					API.query('photos/:id/next', args, callback);
				},
				
				previous: function (args, callback) {
					API.query('photos/:id/previous', args, callback);
				}
			},
			
			by_location: function (args, callback) {
				API.query('photos/bylocation', args, callback);
			},
			
			by_venue: function (args, callback) {
				API.query('photos/byvenue', args, callback);
			},
			
			list: function (args, callback) {
				API.query('photos', args, callback);
			},
			
			query_count: function (args, callback) {
				API.query('querycount', args, callback);
			}
		},
		
		leaderboard: {
			viewed: function (args, callback) {
				API.query('leaderboard/uploadedtoday/viewed', args, callback);
			},
			
			commented: function (args, callback) {
				API.query('leaderboard/uploadedtoday/commented', args, callback);
			},
			
			voted: function (args, callback) {
				API.query('leaderboard/uploadedtoday/voted', args, callback);
			}
		},
		
		socialfeed: function (args, callback) {
			API.query('socialfeed', args, callback);
		}
	};
	
});