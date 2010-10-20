/*global jsonpfu */

/**
 * Name: GitHub
 * Desc: Used to query the GitHub JSONP API (http://develop.github.com)
 * Usage:
 *	jfu.lib('github').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('github').repos.watched({username: 'meltingice'}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('github', function (opts, script) {
	// API helper methods for validation and querying
	var API = {
		query: function (url, data, callback, is_gist) {
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
			
			if (is_gist) {
				query_url = 'http://gist.github.com/' + url;
			} else {
				query_url = 'http://github.com/api/v2/json/' + url;
			}
			
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
			search: function (args, callback) {
				API.query('user/search/:search', args, callback);
			},
			
			show: function (args, callback) {
				API.query('user/show/:username', args, callback);
			},
			
			following: function (args, callback) {
				API.query('user/show/:user/following', args, callback);
			},
			
			followers: function (args, callback) {
				API.query('user/show/:user/followers', args, callback);
			}
		},
		
		repos: {
			watched: function (args, callback) {
				API.query('repos/watched/:user', args, callback);
			},
			
			search: function (args, callback) {
				API.query('repos/search/:q', args, callback);
			},
			
			show: function (args, callback) {
				API.query('repos/show/:user/:repo', args, callback);
			},
			
			user: function (args, callback) {
				API.query('repos/show/:user', args, callback);
			},
			
			collaborators: function (args, callback) {
				API.query('repos/show/:user/:repo/collaborators', args, callback);
			},
			
			contributors: function (args, callback) {
				var endpoint = 'repos/show/:user/:repo/contributors';
				
				if (args.anon) {
					endpoint += '/anon';
					delete args.anon;
				}
				
				API.query(endpoint, args, callback);
			},
			
			watchers: function (args, callback) {
				API.query('repos/show/:user/:repo/watchers', args, callback);
			},
			
			network: function (args, callback) {
				API.query('repos/show/:user/:repo/network', args, callback);
			},
			
			languages: function (args, callback) {
				API.query('repos/show/:user/:repo/languages', args, callback);
			},
			
			tags: function (args, callback) {
				API.query('repos/show/:user/:repo/tags', args, callback);
			},
			
			branches: function (args, callback) {
				API.query('repos/show/:user/:repo/branches', args, callback);
			}
		},
		
		issues: {
			search: function (args, callback) {
				API.query('issues/search/:user/:repo/:state/:search_term', args, callback);
			},
			
			list: function (args, callback) {
				var result;
				
				result = API.query('issues/list/:user/:repo/:state', args, callback);
				if (!result) {
					API.query('issues/list/:user/:repo/label/:label', args, callback);
				}
			},
			
			show: function (args, callback) {
				API.query('issues/show/:user/:repo/:number', args, callback);
			},
			
			comments: function (args, callback) {
				API.query('issues/comments/:user/:repo/:number', args, callback);
			}
		},
		
		commits: {
			list: function (args, callback) {
				API.query('commits/list/:user_id/:repository/:branch', args, callback);
			},
			
			file: function (args, callback) {
				API.query('commits/list/:user_id/:repository/:branch/:path', args, callback);
			},
			
			show: function (args, callback) {
				API.query('commits/show/:user_id/:repository/:sha', args, callback);
			}
		},
		
		tree: {
			show: function (args, callback) {
				API.query('tree/show/:user/:repo/:tree_sha', args, callback);
			},
			
			blob: function (args, callback) {
				API.query('blob/show/:user/:repo/:tree_sha/:path', args, callback);
			},
			
			blobs: function (args, callback) {
				var endpoint = 'blob/all/:user/:repo/:tree_sha';
				
				if (args.blob_meta) {
					endpoint = 'blob/full/:user/:repo/:tree_sha';
					delete args.blob_meta;
				} else if (args.tree_meta) {
					endpoint = 'tree/full/:user/:repo/:tree_sha';
					delete args.tree_meta;
				}
				
				API.query(endpoint, args, callback);
			}
		},
		
		gist: {
			meta: function (args, callback) {
				API.query('api/v1/json/:gist_id', args, callback, true);
			},
			
			gists: function (args, callback) {
				API.query('api/v1/json/gists/:login', args, callback, true);
			}
		}
	};
	
});