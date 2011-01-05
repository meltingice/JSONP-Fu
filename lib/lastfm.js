/*global jsonpfu */

/** 
 * @fileoverview Used to query the {@link http://www.last.fm/api/intro/ Last.fm JSONP API}
 *
 * @author Ryan LeFevre meltingice@meltingice.net
 * @version 1.0
 */

/**
 * Name: last.fm
 * Usage:
 *	jfu.lib('lastfm').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('lastfm').artist.getArtistInfo({artist: 'deadmau5'}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('lastfm', function (opts, script) {
	var api_key, API, def;
	
	if (opts.api_key) {
		api_key = opts.api_key;
	}
	
	API = {
		query: function (method, data, callback) {
			var	query_url = 'http://ws.audioscrobbler.com/2.0/';
			
			if (!api_key) {
				throw "Error: Last.fm requires an API key for all requests";
			}
			
			data.method = method;
			data.format = 'json';
			data.api_key = api_key;

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
	
	// Define all endpoints we can actually use
	def = [
		// album methods
		'album.getBuyLinks',
		'album.getInfo',
		'album.getShouts',
		'album.getTags',
		'album.getTopTags',
		'album.search',
		
		// artist methods
		'artist.getCorrection',
		'artist.getEvents',
		'artist.getImages',
		'artist.getInfo',
		'artist.getPastEvents',
		'artist.getPodcast',
		'artist.getShouts',
		'artist.getSimilar',
		'artist.getTags',
		'artist.getTopAlbums',
		'artist.getTopFans',
		'artist.getTopTags',
		'artist.getTopTracks',
		'artist.search',
		
		// chart methods
		'chart.getHypedArtists',
		'chart.getHypedTracks',
		'chart.getLovedTracks',
		'chart.getTopArtists',
		'chart.getTopTags',
		'chart.getTopTracks',
		
		// event methods
		'event.getAttendees',
		'event.getInfo',
		'event.getShouts',
		
		// geo methods
		'geo.getEvents',
		'geo.getMetroArtistChart',
		'geo.getMetroHypeArtistChart',
		'geo.getMetroHypeTrackChart',
		'geo.getMetroTrackChart',
		'geo.getMetroUniqueArtistChart',
		'geo.getMetroUniqueTrackChart',
		'geo.getMetroWeeklyChartlist',
		'geo.getMetros',
		'geo.getTopArtists',
		'geo.getTopTracks',
		
		// group methods
		'group.getHype',
		'group.getMembers',
		'group.getWeeklyAlbumChart',
		'group.getWeeklyArtistChart',
		'group.getWeeklyChartList',
		'group.getWeeklyTrackChart',
		
		// library methods
		'library.getAlbums',
		'library.getArtists',
		'library.getTracks',
		
		// playlist methods
		'playlist.fetch',
		
		// radio methods
		'radio.search',
		
		// tag methods
		'tag.getInfo',
		'tag.getSimilar',
		'tag.getTopAlbums',
		'tag.getTopArtists',
		'tag.getTopTags',
		'tag.getTopTracks',
		'tag.getWeeklyArtistChart',
		'tag.getWeeklyChartList',
		'tag.search',
		
		// tasteometer methods
		'tasteometer.compare',
		'tasteometer.compareGroup',
		
		// track methods
		'track.getBuylinks',
		'track.getCorrection',
		'track.getFingerprintMetadata',
		'track.getInfo',
		'track.getShouts',
		'track.getSimilar',
		'track.getTags',
		'track.getTopFans',
		'track.getTopTags',
		'track.search',
		
		// user methods
		'user.getArtistTracks',
		'user.getBannedTracks',
		'user.getEvents',
		'user.getFriends',
		'user.getInfo',
		'user.getLovedTracks',
		'user.getNeighbours',
		'user.getNewReleases',
		'user.getPastEvents',
		'user.getPersonalTags',
		'user.getPlaylists',
		'user.getRecentStations',
		'user.getRecentTracks',
		'user.getRecommendedArtists',
		'user.getRecommendedEvents',
		'user.getShouts',
		'user.getTopAlbums',
		'user.getTopArtists',
		'user.getTopTags',
		'user.getTopTracks',
		'user.getWeeklyAlbumChart',
		'user.getWeeklyArtistChart',
		'user.getWeeklyChartList',
		'user.getWeeklyTrackChart',
		
		// venue methods
		'venue.getEvents',
		'venue.getPastEvents',
		'venue.search'
	];
	
	// generate the API from the def array
	return (function (def) {
		var i, j, api_obj = {},
			ep, curr_obj = {};
		
		for (i = 0; i < def.length; i++) {
			ep = def[i].split('.');
			
			if (!api_obj[ep[0]]) {
				api_obj[ep[0]] = {};
			}
			
			if (ep.length === 2) {
				api_obj[ep[0]][ep[1]] = (function (method) {
					return function (args, callback) {
						API.query(method, args, callback);
					};
				}(def[i]));
			} else if (ep.length === 3) {
				if (!api_obj[ep[0]][ep[1]]) {
					api_obj[ep[0]][ep[1]] = {};
				}
				
				api_obj[ep[0]][ep[1]][ep[2]] = (function (method) {
					return function (args, callback) {
						API.query(method, args, callback);
					};
				}(def[i]));
			}
		}
		
		return api_obj;
	}(def));
	
});