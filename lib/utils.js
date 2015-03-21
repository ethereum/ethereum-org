'use strict';

var fs = require('fs');

var utils = {
	isFile: function (filePath)
	{
		try {
			fs.statSync(filePath);
		} catch(err) {
			if(err.code == 'ENOENT') return false;
		}
		return true;
	},
	getFile: function(filePath, args)
	{
		return fs.readFileSync(filePath, args);
	},
	putFile: function(filePath, content)
	{
		return fs.writeFileSync(filePath, content);
	},
	getFiles: function(path)
	{
		return fs.readdirSync(path);
	}
};

module.exports = utils;