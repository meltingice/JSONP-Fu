/*global jsonpfu */

/**
 * Name: Wordpress
 * Desc: Used to query a Wordpress blog's API.
 *
 * NOTE: this uses the "Explicit mode" API defined by the JSON-API plugin
 *
 * IMPORTANT: You need to install and activate the JSON-API plugin
 *	http://wordpress.org/extend/plugins/json-api/
 *
 * Usage:
 *	jfu.lib('wordpress').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('wordpress').posts.recent({count: 3}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('wordpress', function (opts, script) {
	// API helper methods for validation and querying
	var blog_url,
		API = {
			query: function (method, data, callback) {
				var query_url = blog_url;
				
				data.json = method;
				
				script.jsonp_query({
					url: query_url,
					data: data,
					success: function (data) {
						callback(data);
					}
				});
			}
	};
	
	if (!opts.blog_url) {
		throw "JSONP-Fu: Must specify Wordpress blog URL in options!";
	} else {
		blog_url = opts.blog_url;
	}
	
	return {
		posts: {
			recent: function (args, callback) {
				API.query('get_recent_posts', args, callback);
			}
		},
		
		post: {
			show: function (args, callback) {
				API.query('get_post', args, callback);
			}
		},
		
		page: {
			show: function (args, callback) {
				API.query('get_page', args, callback);
			},
			
			index: function (args, callback) {
				API.query('get_page_index', args, callback);
			}
		},
		
		date: {
			posts: function (args, callback) {
				API.query('get_date_posts', args, callback);
			},
			
			index: function (args, callback) {
				API.query('get_date_index', args, callback);
			}
		},
		
		category: {
			posts: function (args, callback) {
				API.query('get_category_posts', args, callback);
			},
			
			index: function (args, callback) {
				API.query('get_category_index', args, callback);
			}
		},
		
		tag: {
			posts: function (args, callback) {
				API.query('get_tag_posts', args, callback);
			},
			
			index: function (args, callback) {
				API.query('get_tag_index', args, callback);
			}
		},
		
		author: {
			posts: function (args, callback) {
				API.query('get_author_posts', args, callback);
			},
			
			index: function (args, callback) {
				API.query('get_author_index', args, callback);
			}
		},
		
		search: function (args, callback) {
			API.query('get_search_results', args, callback);
		}
	};
	
});