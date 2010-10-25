<h1>JSONP-Fu API Documentation</h1>

Each of the above folders contain documentation for the various APIs that JSONP-Fu supports.  If you would like to contribute to the project, documentation improvement is always needed and welcome. I am considering moving all of these pages to the GitHub wiki eventually.

<h2>How to Automatically Generate a Documentation Template</h2>

In order to save you the hassle of having to write out all of the documentation by hand and by scratch, there is a Node.JS script that will automatically generate the documentation for your API plugin.  It's not perfect, but it works well enough to give you a good documentation template to start with.

To automatically generate a documentation template, simply run the Node.JS file scripts/autogen_docs.js. No command-line arguments needed.  It will only generate a documentation template if one doesn't exist already, so don't worry about it overwriting other documentation.  Obviously, <a href="http://nodejs.org/#download">you will need to have Node.JS installed</a> in order to run it, but luckily its very simple to get up and running.

The way it works is, the Node.JS script loads your plugin in to a String, eval's it in a mock JSONP-Fu environment, and inspects the API object that your script returns to jsonpfu.extend(). This lets us know exactly all of the API categories and methods for your API plugin, no matter how it was written (usually).