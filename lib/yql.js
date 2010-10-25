/*global jsonpfu */

/** 
 * @fileoverview Used to make a {@link http://developer.yahoo.com/yql/ YQL query}
 *
 * @author Ryan LeFevre meltingice@meltingice.net
 * @version 1.0
 */

/**
 * Name: Yahoo Query Language
 * Usage:
 *	jfu.lib('yql').query(query);
 *
 * Example:
 *	jfu.lib('yql').query("select * from flickr.photos.recent", function (data) {
 *		console.log(data.results());
 *	});
 */
 
jsonpfu.extend('yql', function (opts, script) {

	// API helper methods for validation and querying
	var API = {		
		query: function (query, query_opts, callback) {
			var query_url = 'http://query.yahooapis.com/v1/public/yql',
				data = query_opts;
				
			if (!query || query.length === 0) {
				throw "Missing or invalid YQL query";
			}
			
			data.format = 'json';
			data.q = query;
			
			if (opts.diagnostics && data.diagnostics === null) {
				data.diagnostics = true;
			}
			if (opts.debug && data.debug === null) {
				data.debug = true;
			}
			if (opts.env && data.env === null) {
				data.env = opts.env;
			}
			
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
		query: function (query, opts, callback) {
			if (typeof(opts) === 'function') {
				callback = opts;
				opts = {};
			}
			
			API.query(query, opts, callback);
		},
		
		select: function (select) {
			return new YQLQuery(select);
		}
	};
	
});
 
function YQLQuery(select) {
	this.data = {
		select: select,
		from: "",
		where: [],
		env: [],
		limit: null,
		offset: 0,
		sort: []
	};
	
	this.query_results = null;
}

YQLQuery.prototype.from = function (from) {
	this.data.from = from;
	return this;
};

YQLQuery.prototype.where = function (where) {
	this.data.where.push(where);
	return this;
};

YQLQuery.prototype.addEnv = function (env) {
	this.data.env.push(env);
	return this;
};

YQLQuery.prototype.limit = function (limit) {
	this.data.limit = limit;
	return this;
};

YQLQuery.prototype.offset = function (offset) {
	this.data.offset = offset;
	return this;
};

YQLQuery.prototype.sort = function (field, desc) {
	if (!desc) {
		desc = 'false';
	}
	
	this.data.sort.push('sort(field="' + field + '", descending="' + desc + '")');
	return this;
};

YQLQuery.prototype.tail = function (count) {
	this.data.sort.push('tail(count=' + count + ')');
	return this;
};

YQLQuery.prototype.truncate = function (count) {
	this.data.sort.push('truncate(count=' + count + ')');
	return this;
};

YQLQuery.prototype.reverse = function () {
	this.data.sort.push('reverse()');
	return this;
};

YQLQuery.prototype.unique = function (field) {
	this.data.sort.push('unique(field="' + field + '")');
	return this;
};

YQLQuery.prototype.sanitize = function (field) {
	this.data.sort.push("sanitize(field='" + field + '")');
	return this;
};

YQLQuery.prototype.results = function () {
	return this.query_results.query.results;
};

YQLQuery.prototype.query = function (opts, callback) {
	var query = "SELECT ",
		that = this;
		
	if (typeof(opts) === 'function') {
		callback = opts;
		opts = {};
	}
	
	query += this.data.select;
	query += " FROM ";
	query += this.data.from;
	
	if (this.data.where.length > 0) {
		query += " WHERE ";
		query += this.data.where.join(' AND ');
	}
	
	if (this.data.limit) {
		query += " LIMIT " + this.data.limit;
	}
	
	if (this.data.offset && this.data.offset > 0) {
		query += " OFFSET " + this.data.offset;
	}
	
	if (this.data.sort.length > 0) {
		query += " | " + this.data.sort.join("|");
	}
	
	
	jfu.lib('yql').query(query, opts, function (data) {
		that.query_results = data;
		callback(that, data);
	});
};