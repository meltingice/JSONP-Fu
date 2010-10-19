jsonpfu.extend('twitpic', function (script) {
	// API helper methods for validation and querying
	var API = {
		validate: function (args, required) {
			var arg, i;

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
		users: {
			show: function (args, callback) {
				API.validate(args, ['username']);
				API.query('2/users/show', args, callback)
			}
		}
	};
	
});