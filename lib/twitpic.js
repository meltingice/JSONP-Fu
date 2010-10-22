/*global jsonpfu */

/**
 * Name: TwitPic
 * Desc: Used to query the TwitPic JSONP API (http://dev.twitpic.com)
 * Usage:
 *	jfu.lib('twitpic').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('twitpic').users.show({username: 'meltingice'}, function (user) {
 *		console.log(user);
 *	});
 */
 
jsonpfu.extend('twitpic', function (opts, script) {
	// API helper methods for validation and querying
	var API = {
		validate: function (args, required) {
			var i;

			for (i = 0; i < required.length; i++) {
				if (!args[required[i]]) {
					throw "TwitPic - Missing required argument: " + required[i];
				}
			}
		},
		
		query: function (url, data, callback) {
			var query_url = 'http://api.twitpic.com/' + url + '.jsonp';
			
			script.jsonp_query({
				url: query_url,
				data: data,
				success: function (data) {
					callback(data);
				}
			});
		}
	};
	
	return {
		media: {
			/*
			 * media/show
			 * Required:
			 *		id - The short ID of the image
			 */
			show : function (args, callback) {
				API.validate(args, ['id']);
				API.query('2/media/show', args, callback);
			}
		},
		
		users: {
			/*
			 * users/show
			 * Required:
			 *		username - username of the user to get info for
			 * Optional
			 *		page - user photo pagination
			 */
			show: function (args, callback) {
				API.validate(args, ['username']);
				API.query('2/users/show', args, callback);
			}
		},
		
		comments: {
			/*
			 * comments/show
			 * Required:
			 *		media_id - The short ID of the image
			 *		page - Comment pagination
			 */
			show : function (args, callback) {
				API.validate(args, ['media_id', 'page']);
				API.query('2/comments/show', args, callback);
			}
		},
		
		place: {
			/*
			 * place/show
			 * Required:
			 *		id - The ID of the place
			 * Optional:
			 *		user - restrict photos to this username
			 */
			show : function (args, callback) {
				API.validate(args, ['id']);
				API.query('2/place/show', args, callback);
			}
		},
		
		places: {
			/*
			 * places/show
			 * Required:
			 *		user - the username of the user
			 */
			show : function (args, callback) {
				API.validate(args, ['user']);
				API.query('2/places/show', args, callback);
			}
		},
		
		events: {
			/*
			 * events/show
			 * Required:
			 *		user - the username of the user
			 */
			show : function (args, callback) {
				API.validate(args, ['user']);
				API.query('2/events/show', args, callback);
			}
		},
		
		event: {
			/*
			 * event/show
			 * Required:
			 *		id - the short ID of the event
			 */
			show : function (args, callback) {
				API.validate(args, ['id']);
				API.query('2/event/show', args, callback);
			}
		},
		
		tags: {
			/*
			 * tags/show
			 * Required:
			 *		tag - The tag to search for, or a comma separated list of tags
			 */
			show : function (args, callback) {
				API.validate(args, ['tag']);
				API.query('2/tags/show', args, callback);
			}
		}
	};
	
});