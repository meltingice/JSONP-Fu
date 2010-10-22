/*global jsonpfu */

/**
 * Name: Flickr
 * Desc: Used to query the Flickr JSONP API (http://www.flickr.com/services/api/)
 * Usage:
 *	jfu.lib('flickr').api_category.api_method(opts, callback);
 *
 * Example:
 *	jfu.lib('flickr').people.getPublicPhotos({user_id: '45836197@N00', per_page: 15}, function (data) {
 *		console.log(data);
 *	});
 */
 
jsonpfu.extend('flickr', function (opts, script) {
	var api_key, API, def;
	
	if (!opts.api_key) {
		throw "Error: Flickr requires an API key for all requests";
	}
	
	api_key = opts.api_key;
	
	API = {
		query: function (method, data, callback) {
			var	query_url = 'http://api.flickr.com/services/rest/';
			
			data.method = 'flickr.' + method;
			data.format = 'json';
			data.api_key = api_key;

			script.jsonp_query({
				url: query_url,
				data: data,
				callback: 'jsonFlickrApi',
				success: function (data) {
					callback(data);
				}
			});
			
			return true;
		}
	};
	
	// Define all endpoints we can actually use
	def = [
		'blogs.getServices',
		'collections.getTree',
		'commons.getInstitutions',
		'contacts.getPublicList',
		'favorites.getPublicList',
		'galleries.getInfo',
		'galleries.getList',
		'galleries.getListForPhoto',
		'galleries.getPhotos',
		'groups.getInfo',
		'groups.search',
		'groups.pools.getContext',
		'groups.pools.getPhotos',
		'interestingness.getList',
		'machinetags.getNamespaces',
		'machinetags.getPairs',
		'machinetags.getPredicates',
		'machinetags.getRecentValues',
		'machinetags.getValues',
		'panda.getList',
		'panda.getPhotos',
		'people.findByEmail',
		'people.findByUsername',
		'people.getInfo',
		'people.getPhotosOf',
		'people.getPublicGroups',
		'people.getPublicPhotos',
		'photos.getAllContexts',
		'photos.getContactsPublicPhotos',
		'photos.getContext',
		'photos.getExif',
		'photos.getFavorites',
		'photos.getInfo',
		'photos.getRecent',
		'photos.getSizes',
		'photos.search',
		'photos.comments.getList',
		'photos.get.getLocation',
		'photos.licenses.getInfo',
		'photos.people.getList',
		'photosets.getContext',
		'photosets.getInfo',
		'photosets.getList',
		'photosets.getPhotos',
		'photosets.comments.getList',
		'places.find',
		'places.findByLatLon',
		'places.getChildrenWithPhotosPublic',
		'places.getInfo',
		'places.getInfoByUrl',
		'places.getPlaceTypes',
		'places.getShapeHistory',
		'places.getTopPlacesList',
		'places.placesForBoundingBox',
		'places.placesForTags',
		'places.resolvePlaceId',
		'places.tagsForPlace',
		'reflection.getMethodInfo',
		'reflection.getMethods',
		'tags.getClusterPhotos',
		'tags.getClusters',
		'tags.getHotList',
		'tags.getListPhoto',
		'tags.getListUser',
		'tags.getListUserPopular',
		'tags.getListUserRaw',
		'tags.getRelated',
		'urls.getGroup',
		'urls.getUserPhotos',
		'urls.getUserProfile',
		'urls.lookupGallery',
		'urls.lookupGroup',
		'urls.lookupUser'
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
		
		api_obj.util = {
			getPhotoUrl: function (photo, size, callback) {
				var url, secret, format;
				
				if (size === 'o') {
					if (!photo.originalsecret || !photo.originalformat) {
						api_obj.photos.getInfo({photo_id: photo.id, secret: photo.secret}, function (data) {
							photo.originalsecret = data.photo.originalsecret;
							photo.originalformat = data.photo.originalformat;
							
							callback(api_obj.util.getPhotoUrl(photo, 'o'));
						});
						
						return;
					} else {
						secret = photo.originalsecret;
						format = photo.originalformat;
					}
				} else {
					secret = photo.secret;
					format = 'jpg';
				}

				callback('http://farm' + photo.farm + 
						'.static.flickr.com/' + 
						photo.server + 
						'/' + 
						photo.id + 
						'_' + 
						secret + 
						'_' + 
						size +
						'.' +
						format);
			}
		};
		
		return api_obj;
	}(def));
	
});