<h1>About the Project</h1>
JSONP-Fu is a project inspired by the latest design of <a href="http://meltingice.net">my own homepage</a> and the work I had to put into it in order to grab data from various JSONP API's.  The idea behind the project is simple: provide a unified and extendible interface that Javascript developers can use to easily query various JSONP API's efficiently and easily instead of having to waste time doing research and figuring out how each different API works.

JSONP-Fu is a similar idea to oEmbed, but uses a different API and works a bit differently.  Instead of throwing a whole URL at an API endpoint, we simply call the API with our parameters and use the JSON data thats returned.

<h1>Project To-Do</h1>

* Write more plugins (and finish incomplete ones)!
* Extensive bug testing (of course)
* Update based on feedback

<h1>How to Use</h1>
Until I get an official GitHub Page up, just check out index.html to see a really short and boring example.  More will be on the way.

<h1>How to Extend</h1>
Support for new JSONP APIs is added via a very simple to use interface.  Feel free to check out jsonp-fu/lib/twitpic.js to see a complete example.

To add support for a new API, add a JS file to the lib directory with the API name as the filename.  I recommend keeping it as simple as possible.

The basic format is:

```js
/*
 * 'my_api' must also be the same name as the filename, minus the .js
 * The 'script' variable passed into the callback has a few nifty JSONP related
 * functions that you will probably want to use, especially script.jsonp_query()
 */
jsonpfu.extend('my_api', function (script) {

	return {
		do: function () {
			script.jsonp_query({
				url: 'http://path.to.json.api.com/some/endpoint',
				data: { variable1: 'some_data' },
				success: function (data) {
					console.log(data);
				}
			});	
		}
	};
});
```

Which means you will be able to do:

```js
jsonpfu.ready('my_api', function () {
	jsonpfu.lib('my_api').do();
});
```

Obviously this API plugin is useless and boring, but you get the idea. Check out one of the existing plugins for more comprehensive info.

<h1>I Want to Make a Plugin!</h1>
Awesome, I'm glad you want to contribute!  The best way to do this would be to fork the project, add your plugin in the lib directory, then send a fork request. If the only change you made was adding your new plugin file, then merging your branch with the trunk should be super easy.