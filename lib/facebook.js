/*global window, jsonpfu, FB */

/**
 * Name: Facebook
 * Desc: Used to query Facebook Connect. Facebook is tricky because it
 *		 requires some extra works due to its asynchronous library loading.
 * Usage:
 *	jfu.lib('facebook').connect_method();
 *
 * Example:
 *	jfu.ready('facebook', function () {
 *		this.api('/rlefevre/feed', function (resp) {
 *			console.log(resp);
 *		});
 *	});
 */
jsonpfu.extend('facebook', function (opts, script) {
	var options = {
		app_id: '',
		status: true,
		cookie: true,
		xfbml: false
	}, fbroot;
	
	/*
	 * Do some special initialization when we are loaded that Facebook
	 * Connect needs.
	 */
	(function () {
		var i, e;
		
		for (i in options) {
			if (options.hasOwnProperty(i)) {
				if (opts[i]) {
					options[i] = opts[i];
				}
			}
		}
		
		/*
		 * Callback function to call when the Facebook Connect library
		 * is finished loading.
		 */
		window.fbAsyncInit = function () {
			FB.init({appId: options.app_id, status: options.status, cookie: options.cookie, xfbml: options.xfbml});
			jsonpfu.manual_ready('facebook', window.FB);
		};
		
		fbroot = document.getElementById('fb-root');
		if (!fbroot) {
			fbroot = document.createElement('div');
			fbroot.id = 'fb-root';
			document.getElementsByTagName('body')[0].appendChild(fbroot);
		}
		
		e = document.createElement('script');
		e.async = true;
		e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
		document.getElementById('fb-root').appendChild(e);
	}());
	
	/*
	 * Since we need to do a manual ready callback, we return nothing here.
	 */
	return;
	
});