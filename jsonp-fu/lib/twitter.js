/*global jsonpfu */

/**
 * Name: Twitter
 * Desc: Used to query the Twitter JSONP API (http://dev.twitter.com)
 * Usage:
 *	jfu.lib('twitter').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('twitter').users.show({screen_name: 'meltingice'}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('twitter', function (opts, script) {
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
			
			query_url = 'http://api.twitter.com/1/' + url + '.json';
			
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
		statuses: {
			public_timeline: function (args, callback) {
				API.query('statuses/public_timeline', args, callback);
			},
			
			user_timeline: function (args, callback) {
				API.query('statuses/user_timeline', args, callback);
			},
			
			show: function (args, callback) {
				API.query('statuses/show/:id', args, callback);
			},
			
			retweets: function (args, callback) {
				API.query('statuses/retweets/:id', args, callback);
			},
			
			friends: function (args, callback) {
				API.query('statuses/friends', args, callback);
			},
			
			followers: function (args, callback) {
				API.query('statuses/followers', args, callback);
			}
		},
		
		users: {
			show: function (args, callback) {
				API.query('users/show', args, callback);
			},
			
			suggestions: function (args, callback) {
				var result = API.query('users/suggestions/:slug', args, callback);
				if (result) {
					return;
				}
				
				API.query('users/suggestions', args, callback);
			}
		},
		
		trends: {
			show: function (args, callback) {
				var result = API.query('trends/:woeid', args, callback);
				if (result) {
					return;
				}
				
				API.query('trends', args, callback);
			},
			
			current: function (args, callback) {
				API.query('trends/current', args, callback);
			},
			
			daily: function (args, callback) {
				API.query('trends/daily', args, callback);
			},
			
			weekly: function (args, callback) {
				API.query('trends/weekly', args, callback);
			},
			
			available: function (args, callback) {
				API.query('trends/available', args, callback);
			}
		},
		
		lists: {
			statuses: function (args, callback) {
				API.query(':user/lists/:id/statuses', args, callback);
			}
		},
		
		friendships: {
			exists: function (args, callback) {
				API.query('friendships/exists', args, callback);
			},
			
			show: function (args, callback) {
				API.query('friendships/show', args, callback);
			}
		},
		
		friends: {
			ids: function (args, callback) {
				API.query('friends/ids', args, callback);
			}
		},
		
		followers: {
			ids: function (args, callback) {
				API.query('followers/ids', args, callback);
			}
		},
		
		geo: {
			nearby_places: function (args, callback) {
				API.query('geo/nearby_places', args, callback);
			},
			
			search: function (args, callback) {
				API.query('geo/search', args, callback);
			},
			
			similar_places: function (args, callback) {
				API.query('geo/similar_places', args, callback);
			},
			
			reverse_geocode: function (args, callback) {
				API.query('geo/reverse_geocode', args, callback);
			},
			
			show: function (args, callback) {
				API.query('geo/id/:place_id', args, callback);
			}
		},
		
		// search is very different, so we have to do things separately
		search: function (args, callback) {
			var query_url = 'http://search.twitter.com/search.json';
			
			script.jsonp_query({
				url: query_url,
				data: args,
				success: function (data) {
					callback(data);
				}
			});
		}
	};
	
});