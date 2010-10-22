/*global jsonpfu */

/**
 * Name: TypePad
 * Desc: Used to query the TypePad JSONP API (http://www.typepad.com/services/apidocs)
 * Usage:
 *	jfu.lib('typepad').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('typepad').api_keys.show({id:'3d20424ed60e58e1'}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('typepad', function (opts, script) {
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
			
			query_url = 'http://api.typepad.com/' + url + '.js';
			
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
		api_keys: {
			show: function (args, callback) {
				API.query('api-keys/:id', args, callback);
			}
		},
		
		applications: {
			show: function (args, callback) {
				API.query('applications/:id', args, callback);
			},
			
			badges: {
				show: function (args, callback) {
					API.query('applications/:id/badges', args, callback);
				},
				
				learning: function (args, callback) {
					API.query('applications/:id/badges/@learning', args, callback);
				},
				
				public: function (args, callback) {
					API.query('applications/:id/badges/@public', args, callback);
				}
			},
			
			external_feed_subscriptions: function (args, callback) {
				API.query('applications/:id/external-feed-subscriptions', args, callback);
			},
			
			groups: function (args, callback) {
				API.query('applications/:id/groups', args, callback);
			}
		},
		
		assets: {
			search: function (args, callback) {
				API.query('assets', args, callback);
			},
			
			show: function (args, callback) {
				API.query('assets/:id', args, callback);
			},
			
			categories: function (args, callback) {
				API.query('assets/:id/categories', args, callback);
			},
			
			comment_tree: function (args, callback) {
				API.query('assets/:id/comment-tree', args, callback);
			},
			
			comments: function (args, callback) {
				API.query('assets/:id/comments', args, callback);
			},
			
			extended_content: function (args, callback) {
				API.query('assets/:id/extended-content', args, callback);
			},
			
			favorites: function (args, callback) {
				API.query('assets/:id/favorites', args, callback);
			},
			
			feedback_status: function (args, callback) {
				API.query('assets/:id/feedback-status', args, callback);
			},
			
			media: function (args, callback) {
				API.query('assets/:id/media-assets', args, callback);
			},
			
			publication_status: function (args, callback) {
				API.query('assets/:id/publication-status', args, callback);
			},
			
			reblogs: function (args, callback) {
				API.query('assets/:id/reblogs', args, callback);
			},
			
			trending: function (args, callback) {
				API.query('assets/trending', args, callback);
			}
		},
		
		auth_tokens: {
			show: function (args, callback) {
				API.query('auth-tokens/:id', args, callback);
			}
		},
		
		badges: {
			show: function (args, callback) {
				API.query('badges/:id', args, callback);
			}
		},
		
		blogs: {
			show: function (args, callback) {
				API.query('blogs/:id', args, callback);
			},
			
			categories: function (args, callback) {
				API.query('blogs/:id/categories', args, callback);
			},
			
			commenting_settings: function (args, callback) {
				API.query('blogs/:id/commenting-settings', args, callback);
			},
			
			comments: {
				published: function (args, callback) {
					API.query('blogs/:id/comments/@published', args, callback);
				},
				
				recent: function (args, callback) {
					API.query('blogs/:id/comments/@published/@recent', args, callback);
				}
			},
			
			crosspost_accounts: function (args, callback) {
				API.query('blogs/:id/crosspost-accounts', args, callback);
			},
			
			page_assets: function (args, callback) {
				API.query('blogs/:id/page-assets', args, callback);
			},
			
			post_assets: {
				show: function (args, callback) {
					API.query('blogs/:id/post-assets', args, callback);
				},
				
				by_category: function (args, callback) {
					API.query('blogs/:id/post-assets/@by-category/:category', args, callback);
				},
				
				by_filename: function (args, callback) {
					API.query('blogs/:id/post-assets/@by-filename/:filename', args, callback);
				},
				
				by_month: function (args, callback) {
					API.query('blogs/:id/post-assets/@by-month/:month', args, callback);
				},
				
				published: {
					by_category: function (args, callback) {
						API.query('/blogs/:id/post-assets/@published/@by-category/:category', args, callback);
					},
					
					by_month: function (args, callback) {
						API.query('blogs/:id/post-assets/@published/@by-month/:month', args, callback);
					},
					
					recent: function (args, callback) {
						API.query('blogs/:id/post-assets/@published/@recent', args, callback);
					}
				},
				
				recent: function (args, callback) {
					API.query('blogs/:id/post-assets/@recent', args, callback);
				}
			},
			
			post_by_email_settings: function (args, callback) {
				API.query('blogs/:id/post-by-email-settings/@by-user/:user', args, callback);
			},
			
			stats: function (args, callback) {
				API.query('blogs/:id/stats', args, callback);
			}
		},
		
		client_library_helpers: {
			method_mappings: function (args, callback) {
				API.query('client-library-helpers/method-mappings', args, callback);
			},
			
			object_types: function (args, callback) {
				API.query('client-library-helpers/object-types', args, callback);
			}
		},
		
		conversations: {
			list: function (args, callback) {
				API.query('conversations', args, callback);
			},
			
			show: function (args, callback) {
				API.query('conversations/:id', args, callback);
			}
		},
		
		domains: {
			show: function (args, callback) {
				API.query('domains/:id', args, callback);
			}
		},
		
		events: {
			show: function (args, callback) {
				API.query('events/:id', args, callback);
			}
		},
		
		external_feed_subscriptions: {
			show: function (args, callback) {
				API.query('external-feed-subscriptions/:id', args, callback);
			},
			
			feeds: function (args, callback) {
				API.query('external-feed-subscriptions/:id/feeds', args, callback);
			}
		},
		
		favorites: {
			show: function (args, callback) {
				API.query('favorites/:id', args, callback);
			}
		},
		
		groups: {
			show: function (args, callback) {
				API.query('groups/:id', args, callback);
			},
			
			audio_assets: function (args, callback) {
				API.query('groups/:id/audio-assets', args, callback);
			},
			
			events: function (args, callback) {
				API.query('groups/:id/events', args, callback);
			},
			
			extenal_feed_subscriptions: function (args, callback) {
				API.query('groups/:id/external-feed-subscriptions', args, callback);
			},
			
			link_assets: function (args, callback) {
				API.query('groups/:id/link-assets', args, callback);
			},
			
			memberships: {
				list: function (args, callback) {
					API.query('groups/:id/memberships', args, callback);
				},
				
				admin: function (args, callback) {
					API.query('groups/:id/memberships/@admin', args, callback);
				},
				
				blocked: function (args, callback) {
					API.query('groups/:id/memberships/@blocked', args, callback);
				},
				
				member: function (args, callback) {
					API.query('groups/:id/memberships/@member', args, callback);
				}
			},
			
			photo_assets: function (args, callback) {
				API.query('groups/:id/photo-assets', args, callback);
			},
			
			post_assets: function (args, callback) {
				API.query('groups/:id/post-assets', args, callback);
			},
			
			video_assets: function (args, callback) {
				API.query('groups/:id/video-assets', args, callback);
			}
		},
		
		import_jobs: {
			show: function (args, callback) {
				API.query('import-jobs/:id', args, callback);
			}
		},
		
		relationships: {
			show: function (args, callback) {
				API.query('relationships/:id', args, callback);
			},
			
			status: function (args, callback) {
				API.query('relationships/:id/status', args, callback);
			}
		},
		
		request_properties: function (args, callback) {
			API.query('request-properties', args, callback);
		},
		
		users: {
			show: function (args, callback) {
				API.query('users/:id', args, callback);
			},
			
			badges: {
				list: function (args, callback) {
					API.query('users/:id/badges', args, callback);
				},
				
				learning: function (args, callback) {
					API.query('users/:id/badges/@learning', args, callback);
				},
				
				public: function (args, callback) {
					API.query('users/:id/badges/@public', args, callback);
				}
			},
			
			blogs: function (args, callback) {
				API.query('user/:id/blogs', args, callback);
			},
			
			elsewhere_accounts: function (args, callback) {
				API.query('users/:id/elsewhere-accounts', args, callback);
			},
			
			events: {
				list: function (args, callback) {
					API.query('users/:id/events', args, callback);
				},
				
				by_group: function (args, callback) {
					API.query('users/:id/events/@by-group/:group', args, callback);
				}
			},
			
			favorites: function (args, callback) {
				API.query('users/:id/favorites', args, callback);
			},
			
			memberships: {
				list: function (args, callback) {
					API.query('users/:id/memberships', args, callback);
				},
				
				admin: function (args, callback) {
					API.query('users/:id/memberships/@admin', args, callback);
				},
				
				by_group: function (args, callback) {
					API.query('users/:id/memberships/@by-group/:group', args, callback);
				},
				
				member: function (args, callback) {
					API.query('users/:id/memberships/@member', args, callback);
				}
			},
			
			notifications: {
				list: function (args, callback) {
					API.query('users/:id/notifications', args, callback);
				},
				
				by_group: function (args, callback) {
					API.query('users/:id/notifications/@by-group/:group', args, callback);
				}
			},
			
			profile: function (args, callback) {
				API.query('users/:id/profile', args, callback);
			},
			
			relationships: {
				list: function (args, callback) {
					API.query('users/:id/relationships', args, callback);
				},
				
				by_group: function (args, callback) {
					API.query('users/:id/relationships/@by-group/:group', args, callback);
				},
				
				by_user: function (args, callback) {
					API.query('users/:id/relationships/@by-user/:user', args, callback);
				},
				
				follower: {
					list: function (args, callback) {
						API.query('/users/:id/relationships/@follower', args, callback);
					},
					
					by_group: function (args, callback) {
						API.query('users/:id/relationships/@follower/@by-group/:group', args, callback);
					}
				},
				
				following: {
					list: function (args, callback) {
						API.query('users/:id/relationships/@following', args, callback);
					},
					
					by_group: function (args, callback) {
						API.query('users/:id/relationships/@following/@by-group/:group', args, callback);
					}
				}
			}
		},
		
		verticals: {
			list: function (args, callback) {
				API.query('verticals', args, callback);
			},
			
			show: function (args, callback) {
				API.query('verticals/:id', args, callback);
			},
			
			tags: function (args, callback) {
				API.query('verticals/:id/tags', args, callback);
			}
		}
	};
	
});