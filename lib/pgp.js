'use strict';

var openpgp = require('openpgp');
var utils = require('./utils');
var _ = require('lodash');
var clearText = require('../config/config');

var PGP_PATH = './keys/pgp/';
var PGP_EXT = '.key';
var PGP_SECRET = '.secret';

var publicKeys;
var privateKeys;
var signed;

init();

function init()
{
	var keyFiles = loadKeysFromDir();

	publicKeys = importKeys(keyFiles.publicKeys);
	privateKeys = importKeys(keyFiles.privateKeys);
}

function signMessage(text, key, pass)
{
	var message = new openpgp.cleartext.CleartextMessage(text);
	if( ! key.primaryKey.isDecrypted)
		key.decrypt(pass);

	message.sign([key]);

	if( ! verifySignedMessage(message, publicKeys))
		return false;

	return message;
}

function verifySignedMessage(msg, keys)
{
	var verify = [];

	verify = msg.verify(keys);

	return _.every(verify, 'valid', true);
}

function saveSignedMessage(message, filename)
{
	utils.putFile(makePath(filename + '.secret'), message.armor());
}

function loadKeysFromDir()
{
	var dir = utils.getFiles(PGP_PATH);
	var keys = {};

	keys.privateKeys = _.filter(dir, function(file) {
		return (file.search(PGP_SECRET + PGP_EXT) > 0);
	});

	keys.publicKeys = _.filter(dir, function(file) {
		return (file.search(PGP_SECRET + PGP_EXT) === -1 && file.search(PGP_EXT) > 0);
	});

	return keys;
}

function importKeys(files)
{
	var pubKey;
	var keys = [];

	for(var k in files) {
		pubKey = loadKey(files[k]);

		if(pubKey && pubKey.keys[0].verifyPrimaryKey()) {
			keys.push(pubKey.keys[0]);
		}
	}

	return (keys.length === 1 ? keys[0] : keys);
}

function loadKey(file)
{
	file = makePath(file);

	if(utils.isFile(file)) {
		return openpgp.key.readArmored(utils.getFile(file, 'utf8'));
	}

	return false;
}

function loadSignedText(file)
{
	if(utils.isFile(file)) {
		return openpgp.cleartext.readArmored(utils.getFile(file, 'utf8'));
	}

	return false;
}

function makePath(file, ext)
{
	return PGP_PATH + file + (ext === true ? PGP_EXT : '');
}

function makeKey(options)
{
	openpgp.generateKeyPair(options)
	.then(function (key) {
		exportKey(key);
	})
	.catch(function (err) {
		console.error(err);
	});
}

function exportKey(key)
{
	var privateKey = key.privateKeyArmored;
	var publicKey = key.publicKeyArmored;
	var filename = key.key.getUserIds()[0].split(' ')[0];
	utils.putFile(makePath(filename, true), publicKey);
	utils.putFile(makePath(filename + PGP_SECRET, true), privateKey);
}