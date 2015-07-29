# Frontier Release

[![Build Status][travis-image]][travis-url] [![dependency status][dep-image]][dep-url]

This repository contains the Frontier Release website.

![Screenshot](https://raw.githubusercontent.com/alexvandesande/frontier-release/master/public/images/screenshot.png "Screenshot")

## Prerequisite
* node
* npm

## Installation
Make sure you have node.js and npm installed.

Clone the repository and install the dependencies

```bash
git clone https://github.com/ethereum/frontier-release
cd frontier-release
npm install
npm install -g grunt-cli
```

##Build static resources

```bash
grunt
```

##Run

```bash
npm start
```

see the interface at http://localhost:3000

[travis-image]: https://travis-ci.org/ethereum/frontier-release.svg
[travis-url]: https://travis-ci.org/ethereum/frontier-release
[dep-image]: https://david-dm.org/ethereum/frontier-release.svg
[dep-url]: https://david-dm.org/ethereum/frontier-release