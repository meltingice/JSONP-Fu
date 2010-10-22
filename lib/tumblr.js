/*global jsonpfu */

/** 
 * @fileoverview Used to query the {@link http://www.tumblr.com/docs/en/api Tumblr JSONP API}
 *
 * @author Ryan LeFevre meltingice@meltingice.net
 * @version 1.0
 */

/**
 * Name: Tumblr
 * Usage:
 *	jfu.lib('tumblr').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('tumblr').posts.show({}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('tumblr', function (opts, script) {

	// API helper methods for validation and querying
	var API = {
		query: function (url, data, callback) {
			var	query_url,
				route = /:([A-Za-z_]+)/gi,
				matches, i,
				username;
				
			if (!data.username && !opts.username) {
				throw "All Tumblr API calls require a username either from initialization or when called";
			}
			
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
			
			/*
			 * Specifying a username in an API call overrides the username
			 * given when initialized.
			 */
			if (data.username) {
				username = data.username;
				delete data.username;
			} else {
				username = opts.username;
			}
			
			query_url = 'http://' + username + '.tumblr.com/api/';
			query_url += url;
			query_url += '/json';
			
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
		posts: {
			show: function (args, callback) {
				API.query('read', args, callback);
			}
		}
	};
	
});